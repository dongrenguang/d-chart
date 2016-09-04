import ManagedObject from "../base/ManagedObject";

export default class Series extends ManagedObject
{
    metadata = {
        properties: {
            data: { type: "object", bindable: true },
            dataNormalizer: { type: "any", defaultValue: d => d },
            scaleX: { type: "any" },
            scaleY: { type: "any" }
        }
    };

    attachToParentNode(parentNode)
    {
        this.container = parentNode.append("g");
        this.initContainer();
    }

    initContainer()
    {
        this.container.classed("series", true);
        this.container.attr("id", this.getId());
    }

    getSeriesGroupNode()
    {
        return this.container.node();
    }

    setData(data)
    {
        this.setProperty("data", data);
        if (!data)
        {
            return;
        }
        this.normalizedData = this.getDataNormalizer().call(this, data);
        this.redraw();
    }

    redraw()
    {

    }

    show()
    {
        this.container
            .transition()
            .style("opacity", 1);
    }

    hide()
    {
        this.container
            .transition()
            .style("opacity", 0);
    }
}
