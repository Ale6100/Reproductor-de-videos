// Array con los nombres de los videos junto con su extensión. Es importante que haya por lo menos uno
// Podría hacer esto dinámicamente, pero la idea de hacerlo manualmente es que cada uno tenga un id único y que cuando quiera borrar uno, los demás permanezcan con su id original
const listaVideosOriginal = [
    {
        nombre: "Abba - Dancing Queen.mp4",
        id: 1
    },
    {
        nombre: "ACDC - Thunderstruck.mp4",
        id: 2
    },
    {
        nombre: "Arbol - El fantasma.mp4",
        id: 3
    },
    {
        nombre: "Arbol - Trenes camiones y tractores.mp4",
        id: 4
    },
    {
        nombre: "Calle 13 - Latinoamérica.mkv",
        id: 5
    },
    {
        nombre: "Coldplay - Adventure Of A Lifetime.mp4",
        id: 6
    },
    {
        nombre: "Coldplay - Paradise.mp4",
        id: 7
    },
    {
        nombre: "Evanescense - Bring Me To Life.mp4",
        id: 8
    },
    {
        nombre: "Intoxicados - Nunca quise.mp4",
        id: 9
    },
    {
        nombre: "La Franela - Hacer un puente.mp4",
        id: 10
    },
    {
        nombre: "León Gieco - Bandidos Rurales.mp4",
        id: 11
    },
    {
        nombre: "Los Autenticos decadentes - Un osito de peluche de Taiwan.mp4",
        id: 12
    },
    {
        nombre: "Mark Ronson Ft Bruno Mars - Uptown Funk.mp4",
        id: 13
    },
    {
        nombre: "Maroon 5 - Girls Like You ft Cardi B.mp4",
        id: 14
    },
    {
        nombre: "Michael Jackson - Beat It.mp4",
        id: 15
    },
    {
        nombre: "Rascal Flatts - Life Is A Highway From Cars.mp4",
        id: 16
    },
    {
        nombre: "Skillet -  Monster.mp4",
        id: 17
    },
    {
        nombre: "Skillet - Hero.mp4",
        id: 18
    },
    {
        nombre: "Soda Stereo - De Música Ligera.mp4",
        id: 19
    },
    {
        nombre: "Soda Stereo - Persiana Americana.mp4",
        id: 20
    },
    {
        nombre: "System of a down - Chop suey.mp4",
        id: 21
    },
    {
        nombre: "The Call - Regina Spektor.mp4",
        id: 22
    },
    {
        nombre: "The Kid LAROI Justin Bieber - STAY.mp4",
        id: 23
    },
    {
        nombre: "ZAZ - Je veux.mp4",
        id: 24
    },
    {
        nombre: "Taylor Swift - Crazier.mp4",
        id: 25
    },
    {
        nombre: "Pharrell Williams - Happy.mp4",
        id: 26
    },
    {
        nombre: "Grand Escape - Radwimps.mp4",
        id: 27
    },
    {
        nombre: "Highway to Hell - ACDC.mp4",
        id: 28
    },
    {
        nombre: "Heartless - Feeling Every Sunset.mp4",
        id: 29
    },
    {
        nombre: "Man Or Muppet - Jason Segel.mp4",
        id: 30
    },
    {
        nombre: "John Farnham - You're The Voice.mp4",
        id: 31
    },
    {
        nombre: "We Are The World - Michael Jackson.mp4",
        id: 32
    },
    {
        nombre: "a-ha - Take On Me.mp4",
        id: 33
    },
    {
        nombre: "Syd Matters - To All Of You.mp4",
        id: 34
    }
]

if (listaVideosOriginal.length === 0) throw new Error("Lista de videos vacía")

export default listaVideosOriginal
