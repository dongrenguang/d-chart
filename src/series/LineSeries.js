import Series from "./Series";

export default class LineSeries extends Series {
	metadata = {
		properties: {
			xPath: { type: "string", defaultValue: "x" },
			yPath: { type: "string", defaultValue: "y" },
			dashed: { type: "boolean" , defaultValue: false },
			opacity: { type: "float", defaultValue: 1 },
            transitionDuration: { type: "int", defaultValue: 800 }
		}
	}

	initContainer()
	{
		super.initContainer();
        this.container.classed("line-series", true);
		this._initLine();
	}

	_initLine()
	{
		this.linePath = this.container.append("path").classed("line", true);
		this.linePath.classed("dashed", this.getDashed());
        this.redraw();
	}

	redraw(transit = true)
	{
		super.redraw(transit);

        const chart = this.getParent();
        if (!chart || !chart.contentFrame || !this.getScaleX()) return;

        const scaleX = this.getScaleX().range([0, chart.contentFrame.width]);
        const scaleY = this.getScaleY().range([chart.contentFrame.height, 0]);

        this.line = d3.svg.line()
			.x((d) => this.getScaleX()(this._getPathValue(d, this.getXPath())))
			.y((d) => this.getScaleY()(this._getPathValue(d, this.getYPath())));

        let chain = this.linePath;
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
            chain.attr("d", this.line(data))
                .style("opacity", this.getOpacity());
        }
	}

	setDashed(dashed)
	{
		this.setProperty("dashed", dashed);
		if (this.linePath)
		{
			this.linePath.classed("dashed", dashed);
		}
	}

    _getPathValue(data, path, separator = "/")
    {
    	const paths = path.split(separator);
    	return paths.reduce((preValue, currentValue) => preValue[currentValue], data);
    }
}
