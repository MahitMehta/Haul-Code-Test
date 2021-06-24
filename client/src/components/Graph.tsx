import React, { useRef, useEffect } from "react";

// Graph Class
import WeekDayGraph from "../classes/graph";

// Types 
import {  userLogModel } from "../types/userData";

// styles
import styles from "../styles/styles.module.scss";

function createGraph(canvas:HTMLCanvasElement | null, data:userLogModel[]) {
    if (!canvas) return; 

    let points:number[] = [];
    points = data?.map((log) => {
        const activeDurationMs = log.dutyStatusDurations?.activeDurationMs;
        if (!activeDurationMs) return 0; 

        const HOUR_IN_MS = (1000 * 60 * 60);
        const hours = Math.round((activeDurationMs / HOUR_IN_MS) * 100) / 100;
        return hours; 
    });

    const width:number = canvas.width; 
    const height:number = canvas.height; 
 
    const ctx:CanvasRenderingContext2D | null = canvas.getContext('2d');
    const weekDayGraph = new WeekDayGraph(ctx, {
        dimensions: { width, height },
        points,
        curve: 0,
    });

    weekDayGraph.create();
}

const Graph = ({ data } : { data: userLogModel[]}) => {
    const CanvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => createGraph(CanvasRef.current, data));

    return (
        <canvas ref={CanvasRef} className={styles.graph_canvas}></canvas>
    )
}

export default Graph; 