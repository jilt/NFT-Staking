import React from 'react'
import { useState } from 'react'

const GetUnlock = ({ straw, locknftId }) => {

	return (
	<div>
		{straw.filter(lock => lock.id.match(new RegExp(locknftId, "i"))).length == 0 ? 
		<p>No unlockable file here</p> 
		: 
		<div>{straw.filter(lock => lock.id.match(new RegExp(locknftId, "i")))
			.map(lockable =>
			<>
				{lockable.CID.length > 0 ? <Button variant="outline-primary"><a href={`https://${lockable.CID}.ipfs.dweb.link`} target="_blank" title="your locked content" alt="your locked content">Get unlockable</a></Button> 
				: <Button variant="outline-primary"><a href={lockable.link} target="_blank" title="your locked content" alt="your locked content">Get unlockable</a></Button>}
			</>
			)
		}
		</div>}
	</div>
	)
}
export default GetUnlock