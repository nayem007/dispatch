import React from 'react'

import PersonEditor from '../../components/PersonEditor'

export default function PersonPage(props) {
  return (
    <PersonEditor
      itemId={props.params.personId}
      goBack={props.history.goBack}
      route={props.route} />
  )
}
