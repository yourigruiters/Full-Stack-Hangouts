# Limbo Hangouts - Final Project @ &lt;/salt&gt
2-week Full-stack application using Websockets built as our final project for &lt;/salt&gt.

## Description

Limbo Hangouts is a full-stack application built in 2 weeks as our final project for our Full Stack Web Developer course at &lt;/salt&gt

The requirements for the application was as following:
The application...
...has to have a frontend written in React and a backend written in Express
...has to follow modern code guidelines and practices
...has to be developed using agile methods over 2 sprints of 1 week each
...has to be presented at the end of the 2 sprints by making a 7-10 minute video following Demo rules.

And for our team specifically, the application had to make use of Websockets for real-time communication.

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

Creating a room happens from the main menu of the chat type. Currently Video and Chat are default. The "Create Room" button allows users to set a title, category, max users and password for the room. The creator of the room becomes the host. When a host leaves the room, a new host is assigned. If the last user of a room leaves, the room is deleted.

#### Chat Rooms

Chat rooms work in the same fashion as traditional [IRC chats](https://en.wikipedia.org/wiki/Internet_Relay_Chat). A user connects to a chat room relating to a specific category and has the opportunity to chat with other users connected around the world. Using websockets, the communication occurs in real-time as well as implementing handlers for users who connect/disconnect from a room.

#### Video Rooms

The application has been built with Youtube as the primary focus, but supports Soundcloud, Vimeo, DailyMotion, Twitch.tv and more (Has not been fully tested!). Users can queue videos and watch them together. 
- When someone in the room skips the video forward/backward, everyone in the room follows along and is synced. 
- If someone pauses or starts, the action is broadcast to every user in the room. 
- When a video ends, every user gets taken to the next video in the queue. 
- If a new user joins a room that has a video which has already started, the new user jumps to timestamp of where everyone else is in the video.


#### Wanted but missed opportunities / Future improvements

- Extensive bug testing of websocket behavior
- Code is quite modular, but refactor for even more modularity
- Split actions into their own *.js files
- Improve styling and animations
- Extend functionality with supporting additional rooms (Music, Streams, Webcams...)
- Refactoring logic, some hacky solutions were taken due to time restraints and is not always consistent with the information passed back and forth between frontend and backend.

##### Landing page

###### Menu Room (Pick a Chat)

###### Chat Room

###### Video Room
