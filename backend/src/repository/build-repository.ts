// Pode definir com 'interface' ao invés de 'abstract class' se preferir
export abstract class BuildRepository {
    abstract startNewBuild(): Promise<{ buildId: string, buildTimestamp: Date }>
    abstract completeBuild(buildId: string, stats: { pagesCount: number, connectionsCount: number }): Promise<void>
    abstract failBuild(buildId: string, errorMessage: string): Promise<void>
    abstract getActiveBuildTimestamp(): Promise<Date>
    abstract cleanupOldBuilds(keepLast?: number): Promise<void>
}