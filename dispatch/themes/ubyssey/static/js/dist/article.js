var articleHeader = false;

$(function(){
    if($(document).scrollTop() > 50){
        articleHeader = true;
        $('.header-site').hide();
        $('.header-article').show();
    }
});

$(document).scroll(function() {
    var top = $(document).scrollTop();
    if (top > 50 && !articleHeader){
        articleHeader = true;
        $('.header-site').hide();
        $('.header-article').fadeIn();
    } else if (top < 50 && articleHeader){
        articleHeader = false;
        $('.header-article').hide();
        $('.header-site').show();
    }
});


var Gallery = React.createClass({displayName: "Gallery",
    getInitialState: function(){
        return {
            index: false,
            image: false,
            visible: false,
        }
    },
    componentDidMount: function(){
        this.setupEventListeners();
    },
    setupEventListeners: function(){

        // Keyboard controls
        key('left', this.previous);
        key('right', this.next);
        key('esc', this.close);

        // Arrow buttons
        $(document).on('click', '.prev-slide', function(e){
            e.preventDefault();
            this.previous();
        }.bind(this));
        $(document).on('click', '.next-slide', function(e){
            e.preventDefault();
            this.next();
        }.bind(this));

        // Clicking outside container
        $(this.getDOMNode()).mouseup(function (e)
        {
            var container = $(this.getDOMNode()).find(".slide");
            if (!container.is(e.target) && container.has(e.target).length === 0)
            {
                this.close();
                $('body').removeClass('no-scroll');
            }
        }.bind(this));

    },
    addSlideTrigger: function(target, action, id_key){
        $(target).on(action, function(e){
            e.preventDefault();
            var image_id = $(e.target).data("id");

            if(gallery.state.visible){
                this.close();
            } else {
                this.open(image_id);
            }

        }.bind(this));
    },
    setIndex: function(index){
        var attachment = this.props.images[index];
        this.setState({
            index: index,
            image: attachment.url,
            caption: attachment.caption,
        });
    },
    setCurrentImage: function(imageId){
        var index = this.props.imagesTable[imageId];
        return this.setIndex(index);
    },
    open: function(imageId){
        this.setCurrentImage(imageId);
        this.setState({ visible: true });
        $('body').addClass('no-scroll');
    },
    close: function(){
        this.setState({
            visible: false,
        });
        $('body').removeClass('no-scroll');
    },
    previous: function(){
        if(this.state.index == 0) return;
        this.setIndex(this.state.index - 1);
    },
    next: function(){
        if(this.state.index + 1 >= this.props.images.length) return;
        this.setIndex(this.state.index + 1);
    },
    renderImage: function(){
        if(this.state.image){
            var imageStyle = { maxHeight: $(window).height() - 200 };
            return (
                React.createElement("div", {className: "slide"}, 
                    React.createElement("img", {className: "slide-image", style: imageStyle, src: this.state.image}), 
                    React.createElement("p", {className: "slide-caption"}, this.state.caption), 
                    this.renderControls()
                )
            );
        }
    },
    renderControls: function(){
        if(this.props.images.length > 1){
            return (
                React.createElement("div", {className: "navigation"}, 
                    React.createElement("a", {className: "prev-slide", href: "#"}, React.createElement("i", {className: "fa fa-chevron-left"})), 
                    React.createElement("span", {className: "curr-slide"}, this.state.index + 1), "  of  ", React.createElement("span", {className: "total-slide"}, this.props.images.length), 
                    React.createElement("a", {className: "next-slide", href: "#"}, React.createElement("i", {className: "fa fa-chevron-right"}))
                )
            );
        }
    },
    render: function() {
        if(this.state.visible){
            var visible = "visible";
        } else {
            var visible = "";
        }
        return (
            React.createElement("div", {className: 'slideshow ' + visible}, 
                React.createElement("div", {className: "image-container"}, 
                    React.createElement("div", {className: "image-inner"}, 
                    this.renderImage()
                    )
                )
            )
        );
    }
});

function gatherImages(){
    var images = [];
    var imagesTable = {};
    var n = 0;
    $('.article-attachment').each(function(){
        var id = $(this).data('id');
        images.push({
            'id': id,
            'url': $(this).attr('src'),
            'caption': $(this).data('caption'),
            'credit': $(this).data('credit'),
        });
        imagesTable[id] = n;
        n++;
    });
    return {
        'list': images,
        'table': imagesTable,
    }
}

var images = gatherImages();

var gallery = React.render(
    React.createElement(Gallery, {images: images.list, imagesTable: images.table}),
    document.getElementById('gallery')
);

gallery.addSlideTrigger('.article-attachment', 'click', 'id');