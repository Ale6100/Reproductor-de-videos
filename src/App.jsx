import './App.css'
import PersonalContextProvider from './components/PersonalContext'
import ContenedorVideo from './components/ContenedorVideo'
import ContenedorLista from './components/ContenedorLista'
import Creditos from './components/Creditos'

function App() {
    return (
        <PersonalContextProvider>
            <main className='p-2 flex justify-between h-screen max-md:flex-col max-md:h-auto gap-3'>
                <ContenedorVideo />
                <ContenedorLista />
            </main>
            <Creditos />
        </PersonalContextProvider>
    )
}

export default App
