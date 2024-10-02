import axios from 'axios'
import { useContext } from 'react'
import { TodoCardsContext } from '../context/TodoCardsContext'
import { SubmitHandler, useForm } from 'react-hook-form'
import showOfflineAlert from '../utils/showOfflineAlert'

type FormFields = {
    newTitle: string
    newDesc: string
}

const EditTodoForm = () => {
    const { todoCards, setTodoCards } = useContext(TodoCardsContext)
    const closeForm = () => {
        reset()
        const editCardInput = document.querySelector('#editCardInput')
        editCardInput?.classList.remove('editCardInputShow')
        editCardInput?.classList.add('editCardInputHide')
    }

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
        reset,
    } = useForm<FormFields>()

    const newTitle = watch('newTitle', '')
    const newDesc = watch('newDesc', '')

    const onSubmit: SubmitHandler<FormFields> = (data) => {
        const savedId = window.localStorage.getItem('currentId')

        const newTodo = {
            id: savedId,
            title: newTitle.length > 0 ? newTitle : undefined,
            description: newDesc.length > 0 ? newDesc : undefined,
        }

        const todoExists = todoCards.some((todo) => {
            return (
                todo.title === newTodo.title ||
                todo.description === newTodo.description
            )
        })

        if (todoExists) {
            setError('root', { message: 'Zadej originální údaje' })
            return
        }

        if (data.newDesc.length === 0 && data.newTitle.length === 0) {
            return setError('root', {
                message: 'Alespoň jedno pole musí být vyplněné',
            })
        }

        axios
            .post('https://adminbe.onrender.com/todos/editTodo', newTodo)
            .then((res) => {
                setTodoCards(res.data)
                reset()

                const editCardInput = document.querySelector('#editCardInput')

                editCardInput?.classList.remove('editCardInputShow')
                editCardInput?.classList.add('editCardInputHide')
            })
            .catch((err) => {
                if (err.code === 'ERR_NETWORK') {
                    showOfflineAlert(true)
                }
                setError('root', { message: 'Někde nastala chyba' })
            })
    }

    return (
        <div
            className='z-50 bg-black bg-opacity-20 absolute top-0 left-0 w-full h-full flex justify-center items-center editCardInputHide'
            id='editCardInput'
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-96 items-center justify-center flex flex-col gap-2 '
            >
                <input
                    type='text'
                    {...register('newTitle', {
                        maxLength: {
                            value: 20,
                            message: 'Nadpis je omezený na 20 znaků',
                        },
                        pattern: {
                            value: /^[A-Za-zá-žÁ-Ž0-9 .()!]+$/i,
                            message: 'Nadpis obsahuje nepovolené znaky',
                        },
                    })}
                    placeholder='Nový nadpis'
                    maxLength={20}
                    title='Zadejte text, který neobsahu nepovolené znaky'
                    className={`${
                        typeof newTitle === 'string' && newTitle.length === 20
                            ? 'border-red-500'
                            : 'border-gray-200 focus:border-gray-500'
                    } h-fit w-full  duration-200 border-2 rounded-lg text-xl p-1`}
                />
                {errors.newTitle && (
                    <p className='text-red-500 text-sm w-full text-right'>
                        {errors.newTitle.message}
                    </p>
                )}
                <textarea
                    {...register('newDesc', {
                        maxLength: {
                            value: 128,
                            message: 'Nadpis je omezený na 20 znaků',
                        },
                        pattern: {
                            value: /^[A-Za-zá-žÁ-Ž0-9 .()!\n]+$/i,
                            message: 'Popis obsahuje nepovolené znaky',
                        },
                    })}
                    placeholder='Nový popis'
                    maxLength={128}
                    value={newDesc}
                    className={`${
                        typeof newDesc === 'string' && newDesc.length === 128
                            ? 'border-red-500'
                            : 'border-gray-200 focus:border-gray-500'
                    }  w-full  border-2 duration-200 rounded-lg text-xl p-1 min-h-12 max-h-32`}
                />

                {errors.newDesc && (
                    <p className='text-red-500 text-sm w-full text-right'>
                        {errors.newDesc.message}
                    </p>
                )}
                <div className='flex justify-between w-full'>
                    <div onClick={closeForm} className='cursor-pointer'>
                        Zavřít formulář
                    </div>
                    <button type='submit' className=' self-end'>
                        Přepsat
                    </button>
                </div>
                {errors.root && (
                    <p className='text-red-500 text-sm'>
                        {errors.root && errors.root.message}
                    </p>
                )}
            </form>
        </div>
    )
}

export default EditTodoForm
