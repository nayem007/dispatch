import React from 'react'

import fetchJsonp from 'fetch-jsonp'

import { FormInput, TextInput } from '../../../components/inputs'
import { Button } from '@blueprintjs/core'

class TwitterEmbedComponent extends React.Component {

  insertTweet() {
    this.getTweet().then(response => {
      const tweet = response
      this.props.updateField('tweet', tweet)
      this.props.stopEditing()
    })
  }

  getTweet() {
    var origURL = this.props.data.url

    var newURL = origURL.replace(/:/g, '%3A').replace(/\//g, '%2F')

    var apiURL = '//publish.twitter.com/oembed?url=' + newURL

    return fetchJsonp(apiURL)
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json)
      return json
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })
  }

  renderInput() {
    return (
      <div>
        <form>
          <FormInput label='URL'>
            <TextInput
              fill={true}
              value={this.props.data.url}
              onChange={e => this.props.updateField('url', e.target.value)} />
          </FormInput>
        </form>
        <Button onClick={() => this.insertTweet()}>Insert</Button>
      </div>
    )
  }

  renderTweet() {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: this.props.data.tweet.html }}></div>
        <form>
          <FormInput label='Caption'>
            <TextInput
              fill={true}
              value={this.props.data.caption}
              onChange={e => this.props.updateField('caption', e.target.value)} />
          </FormInput>
          <FormInput label='Credit'>
            <TextInput
              fill={true}
              value={this.props.data.credit}
              onChange={e => this.props.updateField('credit', e.target.value)} />
          </FormInput>
        </form>
      </div>
    )
  }

  render(){
    return (
      <div className='o-embed o-embed--twitter'>
        {this.props.data.tweet ? this.renderTweet() : this.renderInput()}
      </div>
    )
  }
}

export default {
  type: 'twitter',
  component: TwitterEmbedComponent,
  defaultData: {
    url: '',
    tweet: null,
    caption: '',
    credit: ''
  }
}
