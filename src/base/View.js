import ManagedObject from "./ManagedObject";

export default class View extends ManagedObject
{
    metadata = {
		aggregations: {
			subviews: {
				type: "d-chart.base.View"
			}
		},
        events: {
			addedToParent: { }
		}
    };

    constructor(...args)
    {
        super(...args);
        this.afterInit();
    }

    afterInit()
    {

    }

    init()
	{
        this.$element = $(`<${this.getElementTag()}/>`);
        if (this.id !== null)
        {
            this.$element.attr("id", this.getId());
        }
        this.$container = this.$element;
        this.addStyleClass("d-view");

        this._layout = null;
        this.initLayout();
	}

    getElementTag()
    {
        return "div";
    }

    getLayout()
    {
        return this._layout;
    }

    setLayout(layout)
    {
        this._layout = layout;
        this._layout.attach(this.$container);
    }

    addStyleClass(...args)
    {
        this.$element.addClass(...args);
    }

    removeStyleClass(...args)
    {
        this.$element.removeClass(...args);
    }

    toggleStyleClass(...args)
    {
        this.$element.toggleClass(...args);
    }

    show(...args)
	{
		this.$element.show(...args);
	}

	hide(...args)
	{
		this.$element.hide(...args);
	}

    toggle(...args)
    {
        this.$element.toggle(...args);
    }




    placeAt(target)
    {
        const $target = (target instanceof jQuery ? target : $(target));
        $target.append(this.$element);
    }



    $(...args)
    {
        return this.$element.find(...args);
    }



    addSubview(subview, $container)
    {
        if (subview.getParent())
        {
            subview.removeFromParent();
        }
        this.addAggregation("subviews", subview);
        if ($container)
        {
            subview.placeAt($container);
        }
        else
        {
            this.getLayout().append(subview.$element);
        }
        setTimeout(() => {
            setTimeout(() => {
                subview.fireAddedToParent();
            });
        });
        return this;
    }

    removeSubview(subview, neverUseAgain = false)
    {
        const result = this.removeAggregation("subviews", subview);
        if (result)
        {
            if (neverUseAgain)
            {
                subview.$element.remove();
            }
            else
            {
                subview.$element.detach();
            }
        }
        return result;
    }

    removeAllSubviews(neverUseAgain = false)
    {
        while (this.getSubviews().length > 0)
        {
            this.removeSubview(this.getSubviews()[0], neverUseAgain);
        }
    }

    destroySubviews(suppressInvalidate)
    {
        this.removeAllSubviews(true);
        this.destroyAggregation("subviews", suppressInvalidate);
    }

    removeFromParent()
    {
        if (this.getParent())
        {
            this.getParent().removeSubview(this);
        }
    }








	toString()
	{
		return `${this.getMetadata().getName()}[${this.getId()}]`;
	}
}
