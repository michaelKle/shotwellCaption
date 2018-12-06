var dots = require("dot").process({ path: "./templates"});


function PhotoTemplate(photo)
{
    var photo_ = photo;
    var rectWidth_ = 50;
    var rectPosition_ = 5;
    this.textMargin = 2;

    this.generateSvg = function()
    {
        //onsole.log('Using rect width = ' + rectWidth_);
        var templateFunc = dots.template_89_75;
        var templatewidth = 89, templateheight = 89;
        var imgwidth = templatewidth;
        var imgheight = templatewidth;
    
        var ar = photo_.imgwidth / photo_.imgheight;
            

        if (photo_.imgwidth < photo_.imgheight)
        {
            
            if (photo.small)
            {
                templateFunc = dots.template_75_89;
                templateheight = 89;

                imgwidth = templateheight * ar;
                imgheight  = templateheight;
        
            }
            else
            {
                templateFunc = dots.template_89_150;
            templatewidth = 89;
            

            imgwidth = templatewidth;
            imgheight = templatewidth / ar;

            }
        }
        else
        {
            if (photo.small)
            {
                templateFunc = dots.template_89_75;
                templatewidth = 89;

                imgwidth = templatewidth;
                imgheight  = templatewidth / ar;
        
            }
            else
            {
                templateFunc = dots.template_150_89;
                templateheight = 89;

                imgwidth = templateheight * ar;
                imgheight = templateheight;
            
            }
        }
        //console.log('Photo : ' + photo_.width + '@' + photo_.height + ' ar=' + ar);
        //console.log('Photo : ' + imgwidth + '@' + imgheight + ' ar=' + imgwidth/imgheight);
            
        return templateFunc({
            path: photo_.path,
            rectwidth: rectWidth_,
            rectposx: rectPosition_-this.textMargin,
            caption: photo_.caption,
            imgwidth: imgwidth.toFixed(2),
            imgheight: imgheight.toFixed(2)
        });
    };
    this.adaptCaptionRectangle = function(width)
    {
        rectWidth_ = parseInt(width) + 2 * this.textMargin;
        //console.log('Set rect width to ' + rectWidth_);
    };
}

module.exports.PhotoTemplate = PhotoTemplate;