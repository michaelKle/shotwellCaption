var dots = require("dot").process({ path: "./templates"});


function PhotoTemplate(photo)
{
    var photo_ = photo;
    var rectWidth_ = 50;
    this.textMargin = 2;
    this.textOffset = 5;
    this.textRectOffsetX = 1.5;
    this.textRectOffsetY = 2.5;

    this.getDataForPhoto = function(imgwidth, imgheight, small, captionPlacement)
    {
        var ret = {
            template: dots.template_89_75,
            templateWidth: 89,
            templateHeight: 89
        }
        
        var ar = imgwidth / imgheight;
            

        if (imgwidth < imgheight)
        {
            
            if (small)
            {
                ret.template = dots.template_75_89;
                ret.templateHeight = 89;

                ret.imgwidth = ret.templateHeight * ar;
                ret.imgheight  = ret.templateHeight;
        
            }
            else
            {
                ret.template = dots.template_89_150;
                ret.templateWidth = 89;
            
                ret.imgwidth = ret.templateWidth;
                ret.imgheight = ret.templateWidth / ar;

            }
        }
        else
        {
            if (small)
            {
                ret.template = dots.template_89_75;
                ret.templateWidth = 89;

                ret.imgwidth = ret.templateWidth;
                ret.imgheight  = ret.templateWidth / ar;
        
            }
            else
            {
                ret.template = dots.template_150_89;
                ret.templateHeight = 89;

                ret.imgwidth = ret.templateHeight * ar;
                ret.imgheight = ret.templateHeight;
            
            }
        }

        ret.captionOffsetY = this.textOffset;
        if (captionPlacement == 'bl' || captionPlacement == 'br')
        {
            ret.captionOffsetY = ret.imgheight -  2.5 - this.textOffset;
        }

        ret.captionOffsetX = this.textOffset;
        if (captionPlacement == 'tr'|| captionPlacement == 'br')
        {
            ret.captionOffsetX = ret.imgwidth - rectWidth_ -  this.textOffset;
        }

        return ret;
    };

    this.generateSvg = function()
    {
        var data = this.getDataForPhoto(photo_.imgwidth, photo_.imgheight, photo_.small, photo_.captionPlacement);
        
        return data.template({
            path: photo_.path,
            rectwidth: rectWidth_,
            rectposy: data.captionOffsetY,
            textposy: data.captionOffsetY+this.textRectOffsetY,
            rectposx: data.captionOffsetX,
            textposx: data.captionOffsetX+this.textRectOffsetX,
            caption: photo_.caption,
            imgwidth: data.imgwidth.toFixed(2),
            imgheight: data.imgheight.toFixed(2)
        });
    };
    this.adaptCaptionRectangle = function(width)
    {
        rectWidth_ = parseInt(width) + 2 * this.textMargin;
        //console.log('Set rect width to ' + rectWidth_);
    };
}

module.exports.PhotoTemplate = PhotoTemplate;