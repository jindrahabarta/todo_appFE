import { useContext, useState } from 'react'
import PlusIco from '../icons/PlusIco'
import axios from 'axios'
import { TodoCardsContext } from '../context/TodoCardsContext'
import { SubmitHandler, useForm } from 'react-hook-form'
import showOfflineAlert from '../utils/showOfflineAlert'

type FormFields = {
    title: string
    description: string
    image?: string
}

const AddTodoForm = ({ formId }: { formId: string }) => {
    const [formOpened, setFormOpened] = useState(false)
    const [imageOpened, setImageOpened] = useState(false)
    const { todoCards, setTodoCards } = useContext(TodoCardsContext)
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        resetField,
        reset,
    } = useForm<FormFields>()

    const title = watch('title', '')
    const description = watch('description', '')
    const image = watch('image', '')
    const onSubmit: SubmitHandler<FormFields> = (data) => {
        const newTodo = {
            ...data,
            listId: formId,
            timestamp: new Date().getTime(),
            image:
                typeof image === 'string' && image.length > 0
                    ? image
                    : undefined,
        }

        axios
            .post('http://localhost:3000/todos', newTodo)
            .then((res) => {
                setTodoCards([...todoCards, res.data.newTodo])
                window.localStorage.setItem(
                    'todos',
                    JSON.stringify([...todoCards, res.data.newTodo])
                )
                setFormOpened(false)
                setImageOpened(false)
                reset()
            })
            .catch((error) => {
                if (error.status === 400) {
                    setError('root', { message: error.response.data.message })
                } else if (error.code === 'ERR_NETWORK') {
                    setError('root', { message: 'Něco se pokazilo' })
                    showOfflineAlert(true)
                } else {
                    setError('root', { message: 'Něco se pokazilo' })
                }
            })
    }

    const closeForm = () => {
        reset()
        setFormOpened(false)
        setImageOpened(false)
    }

    return (
        <div>
            {formOpened ? (
                <div className='flex gap-1 group cursor-pointer'>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='w-full flex flex-col gap-2'
                    >
                        <div className='flex gap-1'>
                            <input
                                {...register('title', {
                                    maxLength: {
                                        value: 20,
                                        message:
                                            'Nadpis je omezený na 20 znaků',
                                    },
                                    pattern: {
                                        value: /^[A-Za-zá-žÁ-Ž0-9 .()!:"?,']+$/i,
                                        message:
                                            'Nadpis obsahuje nepovolené znaky',
                                    },
                                    required: 'Prosím zadej nadpis',
                                })}
                                maxLength={20}
                                type='text'
                                placeholder='Nadpis'
                                className={`${
                                    typeof title === 'string' &&
                                    title.length < 20
                                        ? 'border-gray-400 focus:border-gray-500'
                                        : 'border-red-500'
                                } w-full bg-transparent border-b-2  duration-200 `}
                            />
                            <p
                                id='titleCounter'
                                className={`${
                                    typeof title === 'string' &&
                                    title.length < 20
                                        ? 'text-gray-500'
                                        : 'text-red-500'
                                } duration-200`}
                            >
                                {typeof title === 'string' && 20 - title.length}
                            </p>
                        </div>
                        {errors.title && (
                            <p className='text-right text-sm text-red-500'>
                                {errors.title.message}
                            </p>
                        )}
                        <div className='flex gap-1'>
                            <textarea
                                {...register('description', {
                                    maxLength: {
                                        value: 128,
                                        message:
                                            'Nadpis je omezený na 20 znaků',
                                    },
                                    pattern: {
                                        value: /^[A-Za-zá-žÁ-Ž0-9 .()!",':?\n]+$/i,
                                        message:
                                            'Popis obsahuje nepovolené znaky',
                                    },
                                    required: 'Prosím zadej popis',
                                })}
                                maxLength={128}
                                placeholder='Popis'
                                className={`${
                                    typeof description === 'string' &&
                                    description.length < 128
                                        ? 'border-gray-400 focus:border-gray-500 '
                                        : 'border-red-500 '
                                } w-full bg-transparent border-b-2 duration-200 min-h-12 max-h-32`}
                            ></textarea>

                            <p
                                className={`${
                                    typeof description === 'string' &&
                                    description.length < 128
                                        ? 'text-gray-500'
                                        : 'text-red-500'
                                } duration-200`}
                            >
                                {typeof description === 'string' &&
                                    128 - description.length}
                            </p>
                        </div>
                        {errors.description && (
                            <p className='text-right text-sm text-red-500'>
                                {errors.description.message}
                            </p>
                        )}

                        {imageOpened ? (
                            <div>
                                <div className='flex gap-1'>
                                    <input
                                        {...register('image', {
                                            required: 'Zadej obrázek',
                                            pattern: {
                                                value: /^https:\/\/apimeme\.com\/.*/i,
                                                message:
                                                    'Zadej url v požadované podobě',
                                            },
                                        })}
                                        type='text'
                                        placeholder='API Meme'
                                        className={`border-gray-400 focus:border-gray-500 w-full bg-transparent border-b-2  duration-200`}
                                    />
                                    <PlusIco
                                        handleClick={() => {
                                            resetField('image')
                                            setImageOpened(false)
                                        }}
                                        className='stroke-gray-500 w-6 rotate-45'
                                    />
                                </div>
                                {errors.image && (
                                    <p className='text-right text-sm text-red-500'>
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p
                                onClick={() => {
                                    setImageOpened(true)
                                }}
                                className='text-gray-500 hover:text-gray-600 duration-200 self-center'
                            >
                                Přidat obrázek
                            </p>
                        )}
                        <div className='flex w-full justify-between'>
                            <p
                                onClick={closeForm}
                                className='text-gray-500 hover:text-gray-800'
                            >
                                Zavřít
                            </p>
                            <button
                                type='submit'
                                className='flex gap-1 items-center justify-center group/submitBtn cursor-pointer'
                            >
                                <PlusIco className='w-4 stroke-gray-500 group-hover/submitBtn:stroke-gray-800 duration-200'></PlusIco>
                                <p className='text-gray-500 group-hover/submitBtn:text-gray-800 duration-200'>
                                    {isSubmitting ? 'Odesílání' : 'Přidat TODO'}
                                </p>
                            </button>
                        </div>

                        {errors.root && (
                            <p className='text-right text-sm text-red-500'>
                                {errors.root.message}
                            </p>
                        )}
                    </form>
                </div>
            ) : (
                <div
                    onClick={() => setFormOpened(true)}
                    className='flex gap-1 items-center justify-center group cursor-pointer'
                >
                    <PlusIco className='w-4 stroke-gray-500 group-hover:stroke-gray-800 duration-200'></PlusIco>
                    <p className='text-gray-500 group-hover:text-gray-800 duration-200'>
                        Přidat TODO
                    </p>
                </div>
            )}
        </div>
    )
}

export default AddTodoForm
