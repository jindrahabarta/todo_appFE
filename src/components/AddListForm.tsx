import { useContext } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import PlusIco from '../icons/PlusIco'
import { ListsContext } from '../context/ListsContext'
import axios from 'axios'
import showOfflineAlert from '../utils/showOfflineAlert'

type Inputs = {
    title: string
}

const AddListForm = () => {
    const { lists, setLists } = useContext(ListsContext)
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const id = data.title
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(' ', '')

        const newList = {
            id: id,
            title: data.title,
        }

        const listExists = lists.some((list) => {
            return list.id === newList.id
        })

        if (listExists) {
            setError('root', { message: 'Tento list již existuje' })
            return
        }

        axios
            .post('http://localhost:3000/lists', newList)
            .then((res) => {
                if (res.status === 200) {
                    setLists(res.data)
                    reset()
                }
            })
            .catch((err) => {
                if (err.code === 'ERR_NETWORK') {
                    showOfflineAlert(true)
                }
                setError('root', { message: 'Někde nastala chyba' })
            })
    }

    return (
        <div className='h-fit sm:min-w-80'>
            <form
                id='addListForm'
                className='p-1 px-2 w-full flex h-fit gap-1 bg-gray-200 hover:bg-gray-300 shadow-sm has-[:focus]:bg-gray-300 duration-200 rounded-lg'
                onSubmit={handleSubmit(onSubmit)}
            >
                <PlusIco className='w-6 stroke-gray-600'></PlusIco>

                <input
                    {...register('title', {
                        maxLength: 15,
                        required: 'Zadej název listu',
                        pattern: {
                            value: /^[A-Za-zá-žÁ-Ž0-9 .()!]+$/i,
                            message: 'Název obsahuje nepovolené znaky',
                        },
                    })}
                    maxLength={15}
                    className='bg-transparent w-full'
                    placeholder='Název listu'
                    type='text'
                />
                <button type='submit'>
                    {isSubmitting ? 'Posílám' : 'Odeslat'}
                </button>
            </form>
            {errors.root && (
                <p className='text-sm text-red-400'>{errors.root.message}</p>
            )}
            {errors.title && (
                <p className='text-sm text-red-400'>{errors.title.message}</p>
            )}
        </div>
    )
}

export default AddListForm
