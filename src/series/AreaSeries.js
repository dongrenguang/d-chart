import Series from "./Series";

export default class AreaSeries extends Series {
	metadata = {
		properties: {
            xPath: { type: "string", defaultValue: "x" },
            y0Path: { type: "string", defaultValue: "y0" },
            y1Path: { type: "string", defaultValue: "y1" },
            fillColor: { type: "string", defaultValue: "white" },
            opacity: { type: "float", defaultValue: 1 },
            transitionDuration: { type: "int", defaultValue: 800 },
		}
	}

	initContainer()
	{
		super.initContainer();
        this.container.classed("area-series", true);
		this._initArea();
	}

	_initArea()
	{
		const chart = this.getParent();
		this.areaPath = this.container.append("path").classed("area", true);
        this.redraw();
	}

	redraw(transit = true)
	{
		super.redraw(transit);
        const chart = this.getParent();
        if (!chart || !chart.contentFrame || !this.getScaleX()) return;

        const scaleX = this.getScaleX().range([0, chart.contentFrame.width]);
        const scaleY = this.getScaleY().range([chart.contentFrame.height, 0]);

        this.area = d3.svg.area()
			.x(d => scaleX(this._getPathValue(d, this.getXPath())))
			.y0(d => scaleY(this._getPathValue(d, this.getY0Path()) || 0))
			.y1(d => scaleY(this._getPathValue(d, this.getY1Path())));
		let chain = this.areaPath;
        if (chain)      // already attached to parrent
        {
            if (transit)
    		{
    			chain = chain.transition().duration(this.getTransitionDuration());
    		}
            let data = this.normalizedData;
            if (!data)
            {
                data = [];
            }
    		chain.attr("d", this.area(data))
                .style("opacity", this.getOpacity())
                .style("fill", this.getFillColor());
        }
	}

    _getPathValue(data, path, separator = "/")
    {
    	const paths = path.split(separator);
    	return paths.reduce((preValue, currentValue) => preValue[currentValue], data);
    }
}
