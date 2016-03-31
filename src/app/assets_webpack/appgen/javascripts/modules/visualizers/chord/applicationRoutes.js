import React from 'react'
import { Route } from 'react-router'
import ApplicationLoader from '../../publishedApp/containers/ApplicationLoader'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/' />
  );
}
