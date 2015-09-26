var Galleries = require('./Galleries.jsx');

var Article = React.createClass({
    getInitialState: function(){
        return {
            galleries: [],
        }
    },
    componentDidMount: function(){
        // Setup galleries after DOM is loaded
        this.setState({ galleries: this.setupGalleries() });
        refreshAdvertisements();
    },
    setupGalleries: function(){

        var gatherImages = function(gallery){

            var selector, trigger;

            if(gallery){
                var id = $(gallery).data("id");
                selector = '#gallery-' + id + ' .gallery-image';
                trigger = '#gallery-' + id + ' .gallery-thumb';
            } else {
                selector = '#article-' + this.props.articleId + ' .article-attachment';
                trigger = '#article-' + this.props.articleId + ' .article-attachment';
            }

            var images = [];
            var imagesTable = {};
            var n = 0;

            $(selector).each(function(){
                var id = $(this).data('id');
                images.push({
                    'id': id,
                    'url': $(this).data('url'),
                    'caption': $(this).data('caption'),
                    'credit': $(this).data('credit'),
                    'width': $(this).width(),
                    'height': $(this).height()
                });
                imagesTable[id] = n;
                n++;
            });

            return {
                'title': gallery ? $(gallery).data("id") : "Images",
                'list': images,
                'table': imagesTable,
                'selector': selector,
                'trigger': trigger
            }

        }.bind(this);

        var galleries = [];

        galleries.push(gatherImages());

        $('#article-'+this.props.articleId+ ' .gallery-attachment').each(function(){
            galleries.push(gatherImages(this));
        });

        return galleries;

    },
    renderHTML: function(){
        var html = {'__html': this.props.html};
        return (<div className="article-html" dangerouslySetInnerHTML={html}></div>);
    },
    render: function(){
        var html = {'__html': this.props.html};
        return (
            <div className={this.props.html ? "article-slide" : "article-extras"}>
                {this.props.html ? this.renderHTML() : null}
                <Galleries galleries={this.state.galleries} />
            </div>
            );
    }
});

module.exports = Article;