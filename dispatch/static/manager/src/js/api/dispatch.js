import fetch from 'isomorphic-fetch'
import url from 'url'

const API_URL = window.API_URL

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

function buildRoute(route, id) {
  let pieces = route.split('.')

  let fullRoute = API_URL + pieces[0]

  if (id) {
    fullRoute += `/${id}/`
  }

  if (pieces.length > 1) {
    fullRoute += pieces[1]
  }

  // Append slash to all urls
  let lastCharacter = fullRoute.slice(-1)

  if (lastCharacter !== '/') {
    fullRoute += '/'
  }

  return fullRoute
}

function buildHeaders(token, useDefaultHeaders=true) {
  let headers = {}
  if (useDefaultHeaders) {
    headers = DEFAULT_HEADERS
  }
  headers['Authorization'] = token ? `Token ${token}` : ''
  return headers
}

function handleError(response) {
  return response.ok ? response : Promise.reject(response.statusText)
}

function parseJSON(response) {
  return response.json()
    .then(json => response.ok ? json : Promise.reject(json))
}

function getRequest(route, id=null, query={}, token=null) {
  let urlString = buildRoute(route, id) + url.format({ query: query })
  return fetch(
    urlString,
    {
      method: 'GET',
      headers: buildHeaders(token)
    }
  )
  .then(parseJSON)
}

function getPageRequest(uri, token=null) {
  return fetch(
    uri,
    {
      method: 'GET',
      headers: buildHeaders(token)
    }
  )
  .then(parseJSON)
}

function postRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    }
  )
  .then(parseJSON)
}

function postMultipartRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'POST',
      headers: buildHeaders(token, false),
      body: payload
    }
  )
  .then(parseJSON)
}

function deleteRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'DELETE',
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    }
  )
  .then(handleError)
}

function patchRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'PATCH',
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    }
  )
  .then(parseJSON)
}

function patchMultipartRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'PATCH',
      headers: buildHeaders(token, false),
      body: payload
    }
  )
  .then(parseJSON)
}

const DispatchAPI = {
  fetchPage: (token, uri) => {
    return getPageRequest(uri, token)
  },
  auth: {
    getToken: (email, password) => {

      const payload = {
        email: email,
        password: password
      }

      return postRequest('token', null, payload)
    },
    verifyToken: (token) => {
      return getRequest('token', token, null)
    },
    logout: (token) => {
      return deleteRequest('token', null, null, token)
    }
  },
  sections: {
    list: (token, query) => {
      return getRequest('sections', null, query, token)
    },
    get: (token, sectionId) => {
      return getRequest('sections', sectionId, null, token)
    },
    save: (token, sectionId, data) => {
      return patchRequest('sections', sectionId, data, token)
    },
    create: (token, data) => {
      return postRequest('sections', null, data, token)
    },
    delete: (token, sectionId) => {
      return deleteRequest('sections', sectionId, null, token)
    },
  },
  articles: {
    list: (token, query) => {
      return getRequest('articles', null, query, token)
    },
    get: (token, articleId, params) => {
      return getRequest('articles', articleId, params, token)
    },
    save: (token, articleId, data) => {
      return patchRequest('articles', articleId, data, token)
    },
    create: (token, data) => {
      return postRequest('articles', null, data, token)
    },
    delete: (token, articleId) => {
      return deleteRequest('articles', articleId, null, token)
    },
    publish: (token, articleId) => {
      return postRequest('articles.publish', articleId, null, token)
    },
    unpublish: (token, articleId) => {
      return postRequest('articles.unpublish', articleId, null, token)
    }
  },
  pages: {
    list: (token, query) => {
      return getRequest('pages', null, query, token)
    },
    get: (token, pageId, params) => {
      return getRequest('pages', pageId, params, token)
    },
    save: (token, pageId, data) => {
      return patchRequest('pages', pageId, data, token)
    },
    create: (token, data) => {
      return postRequest('pages', null, data, token)
    },
    delete: (token, pageId) => {
      return deleteRequest('pages', pageId, null, token)
    },
    publish: (token, pageId) => {
      return postRequest('pages.publish', pageId, null, token)
    },
    unpublish: (token, pageId) => {
      return postRequest('pages.unpublish', pageId, null, token)
    }
  },
  files: {
    list: (token, query) => {
      return getRequest('files', null, query, token)
    },
    create: (token, data) => {
      return postMultipartRequest('files', null, data, token)
    },
    delete: (token, fileId) => {
      return deleteRequest('files', fileId, null, token)
    }
  },
  images: {
    list: (token, query) => {
      return getRequest('images', null, query, token)
    },
    get: (token, imageId) => {
      return getRequest('images', imageId, null, token)
    },
    save: (token, imageId, data) => {
      return patchRequest('images', imageId, data, token)
    },
    create: (token, data) => {
      return postMultipartRequest('images', null, data, token)
    },
    delete: (token, imageId) => {
      return deleteRequest('images', imageId, null, token)
    }
  },
  templates: {
    list: (token, query) => {
      return getRequest('templates', null, query, token)
    },
    get: (token, templateId) => {
      return getRequest('templates', templateId, null, token)
    }
  },
  persons: {
    list: (token, query) => {
      return getRequest('persons', null, query, token)
    },
    get: (token, personId) => {
      return getRequest('persons', personId, null, token)
    },
    save: (token, personId, data) => {
      return patchMultipartRequest('persons', personId, data, token)
    },
    create: (token, data) => {
      return postMultipartRequest('persons', null, data, token)
    },
    delete: (token, personId) => {
      return deleteRequest('persons', personId, null, token)
    }
  },
  topics: {
    list: (token, query) => {
      return getRequest('topics', null, query, token)
    },
    get: (token, topicId) => {
      return getRequest('topics', topicId, null, token)
    },
    create: (token, data) => {
      return postRequest('topics', null, data, token)
    },
    save: (token, topicId, data) => {
      return patchRequest('topics', topicId, data, token)
    },
    delete: (token, topicId) => {
      return deleteRequest('topics', topicId, null, token)
    },
  },
  tags: {
    list: (token, query) => {
      return getRequest('tags', null, query, token)
    },
    get: (token, tagId) => {
      return getRequest('tags', tagId, null, token)
    },
    create: (token, data) => {
      return postRequest('tags', null, data, token)
    },
    save: (token, tagId, data) => {
      return patchRequest('tags', tagId, data, token)
    },
    delete: (token, tagId) => {
      return deleteRequest('tags', tagId, null, token)
    },
  },
  integrations: {
    get: (token, integrationId) => {
      return getRequest('integrations', integrationId, null, token)
    },
    save: (token, integrationId, data) => {
      return patchRequest('integrations', integrationId, data, token)
    },
    delete: (token, integrationId) => {
      return deleteRequest('integrations', integrationId, null, token)
    },
    callback: (token, integrationId, query) => {
      return getRequest('integrations.callback', integrationId, query, token)
    }
  },
  dashboard: {
    actions: (token) => {
      return getRequest('dashboard/actions', null, {}, token)
    },
    recent: (token) => {
      return getRequest('dashboard/recent', null, {}, token)
    }
  },
  galleries: {
    list: (token, query) => {
      return getRequest('galleries', null, query, token)
    },
    get: (token, galleryId) => {
      return getRequest('galleries', galleryId, null, token)
    },
    create: (token, data) => {
      return postRequest('galleries', null, data, token)
    },
    save: (token, galleryId, data) => {
      return patchRequest('galleries', galleryId, data, token)
    },
    delete: (token, galleryId) => {
      return deleteRequest('galleries', galleryId, null, token)
    }
  },
  zones: {
    list: (token, query) => {
      return getRequest('zones', null, query, token)
    },
    get: (token, zoneId) => {
      return getRequest('zones', zoneId, null, token)
    },
    save: (token, zoneId, data) => {
      return patchRequest('zones', zoneId, data, token)
    },
    widgets: (token, zoneId) => {
      return getRequest('zones.widgets', zoneId, null, token)
    }
  },
  events: {
    list: (token, query) => {
      return getRequest('events', null, query, token)
    },
    get: (token, eventId) => {
      return getRequest('events', eventId, null, token)
    },
    create: (token, data) => {
      return postMultipartRequest('events', null, data, token)
    },
    save: (token, eventId, data) => {
      return patchMultipartRequest('events', eventId, data, token)
    },
    delete: (token, eventId) => {
      return deleteRequest('events', eventId, null, token)
    }
  },
  videos: {
    list: (token, query) => {
      return getRequest('videos', null, query, token)
    },
    get: (token, videoId) => {
      return getRequest('videos', videoId, null, token)
    },
    save: (token, videoId, data) => {
      return patchRequest('videos', videoId, data, token)
    },
    create: (token, data) => {
      return postRequest('videos', null, data, token)
    },
    delete: (token, videoId) => {
      return deleteRequest('videos', videoId, null, token)
    },
  },
  'users': {
    get: (token, userId) => {
      return getRequest('users', userId, null, token)
    },
    save: (token, userId, data) => {
      return patchRequest('users', userId, data, token)
    }
  }
}

export default DispatchAPI
