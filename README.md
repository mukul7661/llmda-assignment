The application will be available at `http://localhost:3000`

## API Documentation

### Events API

#### GET /api/events

- Returns all events
- Response: Array of Event objects

#### POST /api/events

- Creates a new event
- Body:
  ```typescript
  {
    title: string;
    description: string;
    date: string(YYYY - MM - DD);
  }
  ```
- Response: Created Event object

#### PUT /api/events/:id

- Updates an existing event
- Body: Same as POST
- Response: Updated Event object

#### DELETE /api/events/:id

- Deletes an event
- Response: 204 No Content

## Key Technical Decisions

1. **AI Categorization**: Implemented automatic event categorization using OpenAI's GPT-3.5 to reduce manual work and ensure consistent categorization.

2. **TanStack Query**: Used for efficient data fetching, caching, and state management, providing real-time updates and optimistic UI updates.

3. **Prisma ORM**: Chosen for type-safe database operations and easy schema management.

4. **Component Architecture**: Separated concerns into reusable components (Dashboard, EventsList, CreateEventForm) for better maintainability.

## Future Improvements

1. **Authentication & Authorization**

   - Implement user authentication
   - Add role-based access control

2. **Enhanced Analytics**

   - Add more detailed event analytics
   - Include time-based trends
   - Export functionality for reports

3. **Performance Optimizations**

   - Implement pagination for events list
   - Add caching layer for frequently accessed data
   - Optimize AI categorization with batch processing

4. **Feature Enhancements**

   - Event recurrence support
   - Calendar view integration
   - Email notifications
   - Image upload for events
   - Custom category management

5. **Testing**

   - Add unit tests
   - Implement integration tests
   - Add end-to-end testing

6. **Infrastructure**
   - Set up CI/CD pipeline
   - Add monitoring and logging
   - Implement error tracking
   - Docker containerization

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
