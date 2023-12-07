
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// connect to Socket
const socketInstance = io("http://localhost:3000", { withCredentials: true, transports: ['websocket'] });

// console.log(socketInstance);

export const HomePage = () => {

    const [allMessage, setAllMessage] = useState<{ message: String, username: string }[]>([]);

    const [auth, SetAuth] = useState(false);

    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('')
    const [message, setMessage] = useState("");


    // listen for events emitted by the server

    socketInstance.on('connect', () => {
        console.log('Connected to server');
    });







    useEffect(() => {

        socketInstance.on("receiveMessage", (data) => {
            // add to prevState
            setAllMessage((prevMessages) => [...prevMessages, { message: data.message, username: data.username }]);


        })
    }, [socketInstance]);

    // copy room ID
    const copyRoom = () => {
        window.navigator.clipboard.writeText(room);
    }

    // emit with room id
    const handleJoinRoom = (e: React.SyntheticEvent) => {
        e.preventDefault()
        console.log('into handle')
        socketInstance.emit("joinRoom", room as string)
        SetAuth(!auth);
    }


    const sendData = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setAllMessage((prevMessages) => [...prevMessages, { message: message, room: room as string, username: username }]);
        socketInstance.emit("sendMessage", { message: message, room: room as string, username: username });
        setMessage("");
    }

    return (
        <>


            {auth ? (<>
                {/* display messages */}

                <div className="text-center ">
                    <div className="text-5xl p-5">
                        Private message <button onClick={copyRoom} className="rounded-xl w-full md:w-40 text-sm font-semibold p-1 border focus:outline-none focus:ring focus:ring-cyan-300 bg-cyan-600/40 hover:bg-cyan-600 border-gray-300">Copy Room ID</button>
                    </div>

                </div>

                <div className="grid grid-cols-1
                    gap-4 items-center justify-center mb-36 overflow-y-auto p-5 text-xl mt-1 md:mb-28">
                    <div className="flex flex-col flex-auto h-full p-6">
                        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                            <div className="flex flex-col h-full overflow-x-auto mb-4">
                                <div className="flex flex-col h-full">
                                    <div className="grid grid-cols-12 gap-y-2">
                                        {allMessage.map((val, key) => {
                                            return ((val.username === username) ?
                                                (<div key={key} className="col-start-6 col-end-13 p-3 rounded-lg">
                                                    <div className="flex items-center justify-start flex-row-reverse">
                                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                            {val.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                                            {/* message */}
                                                            <div>
                                                                {val.message}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>) :
                                                (
                                                    <div key={key} className="col-start-1 col-end-8 p-3 rounded-lg">
                                                        <div className="flex flex-row items-center">
                                                            {/* Name Logo */}
                                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                                {val.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            {/* Message */}
                                                            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                                                <div>{val.message}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )

                                            )
                                        })}

                                        {/* Left Display */}


                                        {/* Right display */}




                                    </div>
                                </div>

                            </div>


                        </div>


                        {/* send message */}
                        <form onSubmit={sendData}>
                            <div className="fixed bottom-0  text-center left-0 
                    w-full bg-white p-4 grid grid-cols-1 md:grid-cols-2 
                    gap-4 items-center">
                                <div className="rounded">
                                    <input
                                        required
                                        value={message}
                                        onChange={(e) => { setMessage(e.target.value) }}
                                        type="text"
                                        name="roomid"
                                        id="roomid"
                                        placeholder="Enter Message"
                                        className=" rounded-2xl w-full p-1 md:w-96 border-2 border-cyan-300 focus:outline-none focus:ring focus:ring-cyan-800  focus:bg-cyan-50/10  pl-2"
                                    />
                                </div>

                                <div className="rounded">
                                    <button className="rounded-xl w-full md:w-40 text-lg font-semibold p-1 border focus:outline-none focus:ring focus:ring-cyan-300 bg-cyan-600/40 hover:bg-cyan-600 border-gray-300">
                                        Send Message
                                    </button>
                                </div>
                            </div>


                        </form>




                    </div></div>

            </>
            ) : (<>
                {/* Default Page */}
                <div className="container w-3/4 mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div className=" p-4 rounded-xl bg-gray-300/50 ">
                        <div className="text-xl  font-semibold md:text-5xl">

                            ⭐️Welcome to SecureChat
                        </div>
                        <div className="mt-1 md:mt-4 text-justify">SecureChat is a platform that allows you to have secure and private conversations with your friends. To get started, simply enter a unique username and a Room ID. Share this Room ID with your friend, and they can join your secure conversation.</div>

                    </div>
                    <div className=" p-4 rounded-xl bg-gray-300/50 ">
                        <div className="text-xl  font-semibold md:text-5xl">


                            How it Works:
                        </div>
                        <div className="mt-1 md:mt-4 text-justify ">
                            <ol className="list-decimal list-inside space-y-3">
                                <li className="font-semibold">Enter Your Details:
                                    <ul className="font-normal list-disc list-inside ">

                                        <li className="">Choose a unique username.</li>
                                        <li>Enter a Room ID for your private conversation.</li>
                                    </ul>
                                </li>
                                <li className="font-semibold">Share Room ID:
                                    <ul className="font-normal list-disc list-inside">
                                        <li>Share the Room ID with your friend.</li>

                                    </ul>
                                </li>
                                <li className="font-semibold">Start Chatting:
                                    <ul className="font-normal list-disc list-inside ">
                                        <li>Once your friend joins with the Room ID, your secure conversation begins.</li>

                                    </ul>
                                </li>

                            </ol>
                        </div>

                    </div>
                </div>

                {/* Login Details */}
                <div className="container mx-auto p-4 flex-nowrap justify-center text-center gap-4 text-lg">
                    <div className="text-2xl">
                        Enter Username and a Room ID
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <div className="p-4  rounded ">
                            <input value={username} required type="text" name="username" id="username" placeholder="Enter Username" className="p-1 w-56 border focus:outline-none focus:ring focus:ring-cyan-300  focus:bg-cyan-50/10 border-gray-300 pl-2" onChange={(e) => { setUsername(e.target.value) }} />
                        </div>
                        <div className="p-4  rounded ">
                            <input required type="number" name="roomid" id="roomid" placeholder="Enter Room Id" className="w-56 border focus:outline-none focus:ring focus:ring-cyan-300  focus:bg-cyan-50/10 border-gray-300 pl-2" onChange={(e) => { setRoom(e.target.value) }} value={room} />
                        </div>
                        <div className="p-4  rounded ">
                            <button className="w-20 text-lg font-semibold p-1 border focus:outline-none focus:ring focus:ring-cyan-300 bg-cyan-600/40 hover:bg-cyan-600 border-gray-300">Join</button>

                        </div>
                    </form>
                </div>

            </>)
            }




        </>
    )
}