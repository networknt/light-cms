var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var {Paper} = require('material-ui');

var BlogPostView = React.createClass({

    render: function() {
        return (
            <div>
                <div className="blogHeader">
                    <h2 className="mainBlogHeader">NetworkNt Blogs</h2>
                </div>
                <div className="blogPostRoot">
                    <Paper className="blogPostPaper">
                        <div className="title">
                            Title
                        </div>
                        <div className="date">
                            August 27, 2015
                        </div>
                        <div className="content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam assumenda commodi exercitationem facilis fugiat hic, inventore iste itaque iure labore magni minima, mollitia natus neque quibusdam quos sint tenetur vel?</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid amet assumenda, atque aut, dolore ex fuga fugit laudantium necessitatibus non praesentium quaerat quam quo recusandae, rem repellat sit vel!</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A exercitationem minima sequi? Ipsam ipsum iste quasi! Deserunt dolores perferendis placeat voluptates? Beatae corporis cum excepturi facilis molestiae quasi quis repudiandae?</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias blanditiis eligendi facilis nam nobis, omnis quidem rem repellat! Assumenda enim esse est nemo obcaecati repellendus sit tempore unde ut velit!</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam asperiores aut blanditiis eius est expedita, hic iusto magnam minus neque nostrum nulla quam quas reiciendis saepe voluptas voluptatem voluptatibus!</p>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid atque cumque dicta eius laudantium magnam modi molestias natus obcaecati omnis quam quibusdam repudiandae rerum, sint ullam vel voluptate voluptatibus.</p>
                        </div>
                    </Paper>
                    <div className="aboutTheAuthor">
                        <h1>This post was brought to you by <span className="author">Mr. Lorem</span></h1>

                        <p>(Info about the author): Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias aspernatur dignissimos dolorem, eos, eum iste iusto molestiae mollitia non quidem, quis quisquam sed sint vitae? Error hic necessitatibus nostrum!</p>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = BlogPostView;