import { type Response, Router } from "express";

export const buildRouter = Router();

// POST /build - Trigger manual build
buildRouter.post("/build", async (_req, res: Response) => {
	try {
		const { buildService } = res.locals;

		if (!buildService) {
			return res.status(500).json({ error: "BuildService not available" });
		}

		// Iniciar build de forma assíncrona (não bloqueante)
		buildService.build().catch((error: Error) => {
			console.error("[Manual Build] Error:", error);
		});

		return res.status(202).json({
			message: "Build started successfully",
			note: "Build is running in background. Check logs for progress.",
		});
	} catch (error) {
		console.error("[Build Route] Error:", error);
		return res.status(500).json({
			error: "Failed to start build",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});

// POST /build/cleanup - Trigger manual cleanup
buildRouter.post("/build/cleanup", async (req, res: Response) => {
	try {
		const { buildService } = res.locals;

		if (!buildService) {
			return res.status(500).json({ error: "BuildService not available" });
		}

		const keepLast = Number.parseInt(req.body?.keepLast, 10) || 3;

		await buildService.clearOldBuilds(keepLast);

		return res.status(200).json({
			message: "Cleanup completed successfully",
			keepLast,
		});
	} catch (error) {
		console.error("[Cleanup Route] Error:", error);
		return res.status(500).json({
			error: "Failed to cleanup old builds",
			message: error instanceof Error ? error.message : "Unknown error",
		});
	}
});
