import cron from 'node-cron';
import { BuildService } from '../services/build-service';

export class BuildJob {
    constructor(private buildService: BuildService) {
        this.setupListeners();
    }

    private setupListeners() {
        // Listener para build concluído
        this.buildService.on('buildCompleted', async (data: { buildId: string, pagesCount: number, connectionsCount: number }) => {
            console.log(`[BuildJob] Build ${data.buildId} completed successfully`);
            console.log('[BuildJob] 🧹 Starting cleanup...');

            try {
                await this.buildService.clearOldBuilds(3);
                console.log('[BuildJob] ✅ Cleanup completed');
            } catch (error) {
                console.error('[BuildJob] ❌ Cleanup failed:', error);
            }
        });

        // Listener para build falhado
        this.buildService.on('buildFailed', (data: { buildId: string, error: Error | unknown }) => {
            console.error(`[BuildJob] Build ${data.buildId} failed:`, data.error);
        });
    }

    start() {
        // Executa todo dia às 3h da manhã (horário brasileiro)
        cron.schedule('0 3 * * *', async () => {
            console.log('[BuildJob] Starting scheduled build...');

            try {
                await this.buildService.build();
                // Cleanup será executado automaticamente via evento 'buildCompleted'
            } catch (error) {
                console.error('[BuildJob] Scheduled build failed:', error);
            }
        });

        console.log('⏰ Build job scheduled for 3:00 AM daily');
    }

    // Método para executar manualmente (útil pra debug/admin)
    async runNow() {
        console.log('[BuildJob] Running build manually...');
        await this.buildService.build();
        // Cleanup será executado automaticamente via evento 'buildCompleted'
    }
}
