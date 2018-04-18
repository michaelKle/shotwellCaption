var dots = require("dot").process({ path: "./templates"});


function PhotoTemplate(photo)
{
    var photo_ = photo;

    this.generateSvg = function()
    {
        return dots.template_150_100({
            path: photo_.path,
            rectwidth: photo_.rectwidth
        });
    }
}

module.exports.PhotoTemplate = PhotoTemplate;