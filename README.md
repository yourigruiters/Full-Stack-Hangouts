# Limbo Hangouts - Final Project @ &lt;/salt&gt;
2-week Full-stack application using Websockets built as our final project for &lt;/salt&gt;.

## Description

Limbo Hangouts is a full-stack application built in 2 weeks as our final project for our Full Stack Web Developer course at &lt;/salt&gt;

The requirements for the application was as following:

**The application...**

  * ...has to have a frontend written in React and a backend written in Express
  * ...has to follow modern code guidelines and practices
  * ...has to be developed using agile methods over 2 sprints of 1 week each
  * ...has to be presented at the end of the 2 sprints by making a 7-10 minute video following Demo rules.

And for our team specifically, the application had to make use of Websockets for real-time communication.

---
Our application is split into 2 types of rooms (Chat/Video), with availability for adding more types in the future such as Music/Webcam rooms

### Technical implementations

Frontend

- Create-react-app
- Axios
- Lodash 
- node-sass
- react-player
- react-router-dom
- socket.io-client

Backend

- Express
- Socket.io

Styling

- Flexbox
- Responsive design
- SCSS

#### Creating a Room

Creating a room happens from the main menu of the chat type. Currently Video and Chat are the default options. 
The "Create Room" button allows users to set a title, category, max users and password for the room. 
If the last user of a room leaves, the room is deleted.

#### Chat Rooms

Chat rooms work in the same fashion as traditional [IRC chats](https://en.wikipedia.org/wiki/Internet_Relay_Chat). A user connects to a chat room relating to a specific category and has the opportunity to chat with other users connected around the world. Using websockets, the communication occurs in real-time as well as implementing handlers for users who connect/disconnect from a room.

#### Video Rooms

The application has been built with Youtube as the primary focus in video rooms, but supports Soundcloud, Vimeo, DailyMotion, Twitch.tv and more **(Has not been tested!)**. Users can queue videos and watch them together. 

The Video room works with a host system. Anyone in the room can click the button below the video to become a host. The host is able to skip videos and everyone else in the room syncs to the timestamp of where the host is. Any user can add videos to the queue, but the host can choose to skip them. When the host leaves, anyone else can pick up to be the host.

Being the host allows you to:
- Skip to the next video
- Automatically sync everyone in the room to your timestamp, whenever you seek to a new position in the video.

Users can freely play/pause and seek to different timestamps without interrupting anyone elses watching, and then use the 'Sync To Host' button to jump back to where everyone else is. This allows for users to go to any timestamp on their own, and then jump back to where the host is watching at their own discretion.

- When the host skips the video forward/backward, everyone in the room follows along and is synced. 
- If the host pauses or starts, the action is broadcast to every user in the room. 
- When a video ends, the host can click to start the next video in the queue. 
- If a new user joins a room that has a video which has already started, the new user can click the "Sync to Host" button to jump where the rest of the room is watching.

With the current version of the application, new users who join the room have to 'Sync to Host' in order to start watching where everyone else is. A future improvement would be to do this automatically on-join.


#### Wanted but missed opportunities / Future improvements

- Real time sync of videos on joining a room without having to resort to buttons.
- Auto-playing the next video in the queue when the previous video ends.
- Extensive bug testing of websocket behavior
- Code is quite modular, but refactor for even more modularity
- Split actions into their own *.js files
- Improve styling and animations
- Extend functionality with supporting additional rooms (Music, Streams, Webcams...)
- Refactoring logic, some hacky solutions were taken due to time restraints and is not always consistent with the information passed back and forth between frontend and backend.


#### Words on the final project / thoughts

With the given 2 week time limit, we're very happy with where we managed to get to, as using websockets for chat fundamentally is quite easy, but expanding on the functionality to implement feedback on typing, handling disconnection/joining of users, displaying active users quickly makes the application more advanced (for us beginners at least!). Also, having implemented live video sync that smartly uses the chat component from the other "room type" enabled us to re-use a lot of our code instead of having to write separate code for the video rooms and the chat rooms. Going forward, we'll be able to expand on the functionality of the application quite easily to become a convenient place for people to hang out and chat in rooms relating to specific topics (Sports, Mental Health, Stock Trading, etc) and watch videos together. With some minor tweaks (and perhaps a more attractive styling/branding) we think the application is fully usable in real life scenarios allowing for people to chat and watch videos with each other about topics people are interested in.

##### Landing page

![Homepage](/readme_screenshots/homepage.png)

###### Menu Room (Pick a Chat)

###### Chat Room

![Chatroom](/readme_screenshots/chatroom.png)
(Left and right side is 2 different browsers,  simulating 2 users)

###### Video Room
