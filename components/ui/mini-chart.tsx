'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MiniChartProps {
  color?: string;
  height?: number;
  width?: number;
}

export const MiniChart = ({ 
  color = 'var(--color-primary)', 
  height = 24, 
  width = 70 
}: MiniChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[]>([10, 12, 8, 15, 11, 13, 9, 14, 10, 12, 8, 15]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), Math.random() * 10 + 5];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const y = d3.scaleLinear().domain([0, 20]).range([height, 0]);

    const line = d3.line<number>()
      .x((_, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveBasis);

    const area = d3.area<number>()
      .x((_, i) => x(i))
      .y0(height)
      .y1(d => y(d))
      .curve(d3.curveBasis);

    const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`;
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "currentColor").attr("stop-opacity", 0.35);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "currentColor").attr("stop-opacity", 0);

    svg.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", `url(#${gradientId})`)
      .attr("class", "text-primary");

    svg.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("class", "text-primary drop-shadow-[0_0_6px_var(--color-primary)]");

  }, [data, color, height, width]);

  return (
    <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
  );
};
