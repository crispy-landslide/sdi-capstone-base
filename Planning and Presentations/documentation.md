# TROJN Documentation

## User Stories

1. **As a user**, I can create an account
2. I can login.
3. I can create an office or wait to be added
4. I can update my user information
5. I can see all the previous events for my office
6. I can click on an event and see that event's information
7. I can go to a team page to view the different teams
8. I can go to a task list page to see what has been accomplished
9. I can go to an attack page to view the attacks
10. I can go to the report page to view the event report

11. **As an editor**, I can create a new event
12. I can create tasks
13. I can mark tasks as complete and edit
14. I can create and edit attacks
15. I can upload a report (word doc or pdf)

16. **As an admin**, I can create teams
17. I can add/edit users to teams
18. I can add/edit users in my office
19. I can make other users admin
20. I can view all users in my office
21. I can remove users from teams
22. I can remove users from my office
23. I can delete tasks, attacks, and uploaded reports

## API Routes

**POST (CREATE)**
- `/api/users`
- `/api/offices`
- `/api/offices/add-user`
- `/api/offices/:office_id/events`
- `/api/offices/:office_id/event/:event_id/tasks`
- `/api/offices/:office_id/event/:event_id/missions`
- `/api/office/:office_id/event/:event_id/attacks`
- `/api/office/:office_id/event/:event_id/teams`
- `/api/office/:office_id/events/:event_id/teams/:team_id/add-user`

**GET (READ)**
- `/api/users/my-account`
- `/api/offices/:office_id`
- `/api/offices/:office_id/events`
- `/api/offices/:office_id/events/:event_id`
- `/api/offices/:office_id/events/:event_id/tasks`
- `/api/offices/:office_id/events/:event_id/missions`
- `/api/offices/:office_id/events/:event_id/teams`
- `/api/offices/:office_id/events/:event_id/teams/:team_id/teams`
- `/api/offices/:office_id/events/:event_id/teams/:team_id/users`
- `/api/offices/:office_id/events/:event_id/attacks`
- `/api/offices/:office_id/events/:event_id/attacks/:attack_id`


**PATCH (UPDATE)**
- `/api/users/:user_email`
- `/api/offices/:office_id`
- `/api/offices/:office_id/events/:event_id`
- `/api/offices/:office_id/events/:event_id/tasks/:task_id`
- `/api/offices/:office_id/events/:event_id/missions/:mission_id`
- `/api/offices/:office_id/events/:event_id/attacks/:attack_id`
- `/api/offices/:office_id/events/:event_id/teams/:team_id`
- `/api/offices/:office_id/events/:event_id/teams/:team_id/edit-user`


**DELETE (DELETE)**
- `/api/users/my-account`
- `/api/offices/:office_id`
- `/api/offices/:office_id/events/:event_id`
- `/api/offices/:office_id/events/:event_id/teams`
- `/api/offices/:office_id/events/:event_id/teams/:team_id`
- `/api/offices/:office_id/events/:event_id/tasks`
- `/api/offices/:office_id/events/:event_id/tasks/:task_id`
- `/api/offices/:office_id/events/:event_id/tasks/:missions`
- `/api/offices/:office_id/events/:event_id/tasks/:missions/mission_id`
- `/api/offices/:office_id/events/:event_id/attacks`
- `/api/offices/:office_id/events/:event_id/attacks/:attack_id`
- `/api/offices/:office_id/events/:event_id/teams/:team_id/remove-user`

## ERD

![ERD](/docs/images/ERD.jpg)