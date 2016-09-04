import Series from "./Series";

export default class WordCloudSeries extends Series
{
    metadata = {
        properties: {
            data: { type: "object", bindable: true },
            minValue: { type: "float", defaultValue: 0 },
            maxValue: { type: "float", defaultValue: 100 },
            minFontSize: { type: "float", defaultValue: 16 },
            maxFontSize: { type: "float", defaultValue: 32 }  // 12 * 7
        },
    };
    
    attachToParentNode(parentNode)
    {
        this.container = parentNode.append("g");
        this.initContainer();
    }
    
    initContainer()
    {
        this.container.classed("word-cloud-series", true);
        this._initScales();
    }
    
    _initScales()
    {
        this.colorScale = d3.scale.category20();
        this.fontSizeScale = d3.scale.linear()
            .domain([this.getMinValue(), this.getMaxValue()])
            .range([this.getMinFontSize(), this.getMaxFontSize()]);
    }
    
    setData(data)
    {
        this.setProperty("data", data);
        if (!data)
        {
            return;
        }
        this._normalizedData = this.getDataNormalizer()(data);

        let minValue = this._normalizedData[0].size;
        let maxValue = this._normalizedData[0].size;
        this._normalizedData.forEach(datum => {
            if (datum.size < minValue) {
                minValue = datum.size;
            }
            if (datum.size > maxValue) {
                maxValue = datum.size;
            }
        })
        this.setMinValue(minValue);
        this.setMaxValue(maxValue);

        this.redraw();
    }

    redraw()
    {
        super.redraw();
        if (this.container && this._normalizedData)
        {
            d3.layout.cloud()
                .size([this.getParent().contentFrame.width, this.getParent().contentFrame.height])
                .words(this._normalizedData)
                .rotate(() => Math.random() > 0.5 ? 0 : 90)
                .font("Microsoft YaHei")
                .fontSize(d => this.fontSizeScale(d.size))
                .on("end", this._drawWordCloud.bind(this, this._normalizedData)).start();
        }
    }

    _drawWordCloud(data)
    {
        const contentFrame = this.getParent().contentFrame;
        let textSelection = this.container
            .attr("transform", `translate(${contentFrame.width / 2}, ${contentFrame.height / 2 })`)
            .selectAll("text")
            .data(data)
            .enter()
            .append("text");
        textSelection = this.container
            .selectAll("text")
            .data(data);
        textSelection
            .style("font-size", d => `${d.size}px`)
            .style("font-family", "Microsoft YaHei")
            .style("fill", (d, i) => this.colorScale(i))
            .style("stroke-width", 0)
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }

    setMinValue(min)
    {
        this.setProperty("minValue", min);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.domain([
                this.getMinValue(), this.getMaxValue()
            ]);
        }
    }

    setMaxValue(max)
    {
        this.setProperty("maxValue", max);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.domain([
                this.getMinValue(), this.getMaxValue()
            ]);
        }
    }

    setMinFontSize(size)
    {
        this.setProperty("minFontSize", size);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.range([
                this.getMinFontSize(), this.getMaxFontSize()
            ]);
        }
    }

    setMaxFontSize(size)
    {
        this.setProperty("maxFontSize", size);
        if (this.fontSizeScale)
        {
            this.fontSizeScale.range([
                this.getMinFontSize(), this.getMaxFontSize()
            ]);
        }
    }
}
