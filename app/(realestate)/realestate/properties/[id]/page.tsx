import React from 'react'

const PropertyUpdatePage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    const { id } = await props.params
  return (
    <div>
      PropertyUpdatePage
    </div>
  )
}

export default PropertyUpdatePage
