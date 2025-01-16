import ChatList from "./chatList";



const ChatApp = () => {

    return (
        <div>
            <form >
                <input
                    type="text"
                    placeholder="メッセージ……"
                />
                <button>
                    送信
                </button>
            </form>
            <ChatList />
        </div>
    )
}

export default ChatApp;