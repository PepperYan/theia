/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from "inversify";
import { MessageService, Emitter, Event } from "@theia/core";
import { QuickOpenService, QuickOpenItem, QuickOpenMode, ConfirmDialog } from "@theia/core/lib/browser";
import { GitRepositoryTracker } from "./git-repository-tracker";
import { Git, Repository } from "../common";

@injectable()
export class GitSyncService {

    @inject(Git)
    protected readonly git: Git;

    @inject(GitRepositoryTracker)
    protected readonly repositoryTracker: GitRepositoryTracker;

    @inject(MessageService)
    protected readonly messageService: MessageService;

    @inject(QuickOpenService)
    protected readonly quickOpenService: QuickOpenService;

    protected readonly onDidChangeEmitter = new Emitter<void>();
    readonly onDidChange: Event<void> = this.onDidChangeEmitter.event;

    protected _syncing = false;
    get syncing(): boolean {
        return this._syncing;
    }
    setSyncing(syncing: boolean): void {
        this._syncing = syncing;
        this.onDidChangeEmitter.fire(undefined);
    }

    canSync(): boolean {
        if (this._syncing) {
            return false;
        }
        const status = this.repositoryTracker.selectedRepositoryStatus;
        return !!status && !!status.branch && !!status.upstreamBranch;
    }
    async sync(): Promise<void> {
        const repository = this.repositoryTracker.selectedRepository;
        const status = this.repositoryTracker.selectedRepositoryStatus;
        if (!this.canSync() || !repository) {
            return;
        }
        const rebase = await this.shouldRebase();
        if (rebase === undefined) {
            return;
        }
        const upstreamBranch = status && status.upstreamBranch;
        if (!(await this.confirm('Sync changes',
            rebase ? `This action will fetch, rebase and push commits from and to '${upstreamBranch}'.`
                : `This action will pull and push commits from and to '${upstreamBranch}'.`))) {
            return;
        }
        this.setSyncing(true);
        try {
            await this.pull(repository, rebase);
            if (this.shouldPush(repository)) {
                await this.push(repository);
            }
        } finally {
            this.setSyncing(false);
        }
    }
    protected shouldRebase(): Promise<boolean | undefined> {
        return this.pick(`Pick a sync method:`, [{
            label: 'Pull and push commits',
            value: false
        }, {
            label: 'Fetch, rebase and push commits',
            value: true
        }]);
    }

    canPublish(): boolean {
        if (this.syncing) {
            return false;
        }
        const status = this.repositoryTracker.selectedRepositoryStatus;
        return !!status && !!status.branch && !status.upstreamBranch;
    }
    async publish(): Promise<void> {
        const repository = this.repositoryTracker.selectedRepository;
        const status = this.repositoryTracker.selectedRepositoryStatus;
        const branch = status && status.branch;
        if (!this.canPublish() || !repository || !branch) {
            return;
        }
        const remote = await this.getRemote(repository, branch);
        if (remote &&
            await this.confirm('Publish changes', `This action will push commits to '${remote}/${branch}' and track it as an upstream branch.`)
        ) {
            await this.push(repository, {
                remote, branch, setUpstream: true
            });
        }
    }
    protected async getRemote(repository: Repository, branch: string): Promise<string | undefined> {
        const remotes = await this.git.remote(repository);
        if (remotes.length === 0) {
            this.messageService.warn('Your repository has no remotes configured to publish to.');
            return undefined;
        }
        if (remotes.length === 1) {
            return remotes[0];
        }
        return this.pick(`Pick a remote to publish the branch ${branch} to:`, remotes);
    }

    protected async shouldPush(repository: Repository): Promise<boolean> {
        const status = await this.git.status(repository);
        return status.aheadBehind && status.aheadBehind.ahead > 0 || true;
    }
    protected async pull(repository: Repository, rebase: boolean): Promise<void> {
        const args = ['pull'];
        if (rebase) {
            args.push('-r');
        }
        try {
            await this.git.exec(repository, args);
        } catch (e) {
            this.error(e);
        }
    }
    protected async push(repository: Repository, { remote, branch, setUpstream }: {
        remote?: string,
        branch?: string,
        setUpstream?: boolean
    } = {}): Promise<void> {
        const args = ['push'];
        if (setUpstream) {
            args.push('-u');
        }
        if (remote) {
            args.push(remote);
        }
        if (branch) {
            args.push(branch);
        }
        try {
            await this.git.exec(repository, args);
        } catch (e) {
            this.error(e);
        }
    }

    protected pick(placeholder: string, elements: string[]): Promise<string | undefined>;
    protected pick<T>(placeholder: string, elements: { label: string, value: T }[]): Promise<T | undefined>;
    protected pick(placeholder: string, elements: (string | { label: string, value: Object })[]): Promise<Object | undefined> {
        return new Promise<Object | undefined>(resolve => {
            const items = elements.map(element => {
                const label = typeof element === 'string' ? element : element.label;
                const value = typeof element === 'string' ? element : element.value;
                return new QuickOpenItem({
                    label,
                    run: mode => {
                        if (mode !== QuickOpenMode.OPEN) {
                            return false;
                        }
                        resolve(value);
                        return true;
                    }
                });
            });
            this.quickOpenService.open({
                onType: (lookFor, acceptor) => acceptor(items)
            }, { placeholder, onClose: () => resolve(undefined) });
        });
    }

    protected confirm(title: string, msg: string): Promise<boolean> {
        return new ConfirmDialog({ title, msg, }).open();
    }

    // tslint:disable-next-line:no-any
    protected error(e: any): void {
        if ('message' in e && e['message']) {
            this.messageService.error(e['message']);
        } else {
            console.error(e);
        }
    }

}
