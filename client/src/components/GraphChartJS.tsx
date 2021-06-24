import React from "react";
import { Line } from "react-chartjs-2";

// Types 
import {  userLogModel } from "../types/userData";

const GraphChartJS = ({ hourData } : { hourData: userLogModel[]}) => {
      let points:number[] = [];
      points = hourData?.map((log) => {
          const activeDurationMs = log.dutyStatusDurations?.activeDurationMs;
          if (!activeDurationMs) return 0; 

          const HOUR_IN_MS = (1000 * 60 * 60);
          const hours = Math.round((activeDurationMs / HOUR_IN_MS) * 100) / 100;
          return hours; 
      });

    const data = {
        labels: new Array(7).fill(0).map((_, index) => {
          return `Day ${index + 1}`;
        }),
        datasets: [
          {
            label: '# of Hours Worked',
            data: points,
            fill: false,
            backgroundColor: '#8ecae6',
            borderColor: '#219ebc',
          },
        ],
      };
      
      const options = {
  
      };
      

    return (
        <>
            <Line type={""} data={data} options={options} />
        </>
    )
}

export default GraphChartJS;