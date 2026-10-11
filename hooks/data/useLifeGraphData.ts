"use client";

import { useEffect, useState } from "react";
import { UseLifeGraphDataResult, LifeGraphApiResponse } from "@/types/life-graph";

export function useLifeGraphData(): UseLifeGraphDataResult {
    const [data, setData] = useState<LifeGraphApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [requestKey, setRequestKey] = useState<number>(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadLifeGraph() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/lifegraph", {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`LifeGraph request failed with status ${response.status}`);
                }

                const result = (await response.json()) as LifeGraphApiResponse;
                setData(result); 
            } catch (requestError) {
                if (requestError instanceof DOMException && requestError.name === "AbortError") {
                return;
                }
                setError(requestError instanceof Error ? requestError.message : "Failed to fetch LifeGraph data");
            } finally {
                if(!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }
        loadLifeGraph();
        return () => controller.abort();
    }, [requestKey]);

    return {
        data,
        loading,
        error,
        refetch: () => setRequestKey((prev) => prev + 1),
    }
}