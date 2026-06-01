//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Metadata showing title 
//Descrption: Each page will show unique title
//First written on: 
//Edited on:

import React from 'react'
import {Helmet} from 'react-helmet';

const MetaData = ({title}) => {
  return (
    <Helmet>
        <title>{`Cafe KKJ - ${title} `}</title>
    </Helmet>
  )
}

export default MetaData