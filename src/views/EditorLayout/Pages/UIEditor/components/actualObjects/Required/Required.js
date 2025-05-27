import React from 'react'

const Required = ({ required }) => required ? <span style={{ color: "red" }}>*</span> : null


export default Required;