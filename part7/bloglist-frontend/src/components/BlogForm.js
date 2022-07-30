import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, Box, Stack, TextField } from '@mui/material'

import { createBlog } from "../reducers/blogReducer"
import { showNotification } from "../reducers/notificationReducer"

const BlogForm = ({ testfn }) => {
    const dispatch = useDispatch()
    const [formVisible, setFormVisible] = useState('none')
    const [formDisabled, setFormDisabled] = useState(false)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const user = useSelector(state => state.user)
    
    const handleAdd = async (event) => {
        event.preventDefault()
        if (testfn) testfn({ title, url, author })
        else {
            await setFormDisabled(true)
            try {
                dispatch(createBlog({ title, url, author }, user))
                setTitle('')
                setAuthor('')
                setUrl('')
                setFormVisible('none')
                dispatch(showNotification('success', 'Blog added'))
            }
            catch (e) { dispatch(showNotification('error', e.response.data)) }
            finally { setFormDisabled(false) }
        }
    }

    return (<Box mb={2} width={250}>
        <Button type="button" style={{ display: formVisible ? '' : 'none' }} onClick={() => setFormVisible('')}>Add blog...</Button>
        <form onSubmit={handleAdd} style={{display: formVisible}}>
            <fieldset disabled={formDisabled}>
                <Stack spacing={1}>
                    <TextField label="Title" size="small" value={title} onChange={({ target }) => setTitle(target.value)} />
                    <TextField label="Author" size="small" value={author} onChange={({ target }) => setAuthor(target.value)} />
                    <TextField label="URL" size="small" value={url} onChange={({ target }) => setUrl(target.value)} />
                    <div>
                        <Button type="submit" variant="contained" size="small" sx={{mr: 1}}>Add</Button>
                        <Button size="small" onClick={() => setFormVisible('none')}>Cancel</Button>
                    </div>
                </Stack>
            </fieldset>
        </form>
    </Box>)
}


export default BlogForm