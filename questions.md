1. What is the difference between Component and PureComponent?

> A **Component** re-render when the parent component re-render either by props or state changes, it can lead to unnecessary re-render of the component and its children but it also provide more flexibility for complex logic/user interactions. A **PureComponent** re-render if its state changes, if the parent component re-render without changing the props, it won't cause unnecessary re-render for the PureComponent (child component).

- Give an example where it might break my app.

> By using a **PureComponent** that receives a complex object as a prop, for example when its parent mutate that object instead of creating a new one when updating the state. The PureComponent won't know there is a change, then this won't re-render and the app won't reflect the update to the end user.

2. Context + ShouldComponentUpdate might be dangerous. Why is that?

> Due to how **Context API** works in React, since a change in Context value triggers re-renders in all components consuming that Context, even if a component implements **shouldComponentUpdate** lifecycle method, it'll still receive re-render calls when the Context value updates. By having scenarios combining both React features, it can lead to complex maintenance in the code and difficult debugging.

3. Describe 3 ways to pass information from a component to its PARENT.

> By using **1) State lifting** between child and parent components, using **2) Context API** and with **3) Callback functions** by passing as a prop a function from the parent to the child component.

4. Give 2 ways to prevent components from re-rendering.

> By using **1) React.memo** in functional components or even using hooks like `useMemo` and `useCallback`, and for class components by using **2) shouldComponentUpdate** method.

5. What is a fragment and why do we need it?

> A **Fragment** is a special React component (`<>...</>` shorthand) to group multiple elements without adding a wrapper node to the DOM. We need to use this for example in cases where we don't want to affect the layout by adding extra wrapper node.

- Give an example where it might break my app.

> One example could be by missing to add the **key** attribute within a list of items that are wrapped by a **Fragment**.

6. Give 3 examples of the HOC pattern.

> For example for 1) Conditional Rendering, let's say for user permissions or authentication, we can display different UI. Another use case can be for 2) Data Fetching since we can manage loading and error states as well as URL endpoint for different components in our app. A third example could be for 3) Styling some components with default ones, maybe some branding styles.

7. What's the difference in handling exceptions in promises, callbacks and async…await?

> Handling exceptions with **Promises** is by catching them in a chainable structure, for **Callbacks** it is managed by error-first handling and checking for errors explicitly in the callback itself, for **Async/Await** we can use `try/catch` blocks which it improves code readability.

8. How many arguments does setState take and why is it async.

> `setState()` function takes 2 arguments, the first one is the data to be updated (either and object or a function) and the second one is an optional callback that let us modify the state behavior after a re-render. It is async because of performance when updates from different states happens in group.

9. List the steps needed to migrate a Class to Function Component.

> I would say replacing the use of `setState` function to `useState` function (hook), then replacing lifecycle methods like `componentDidMount` with `useEffect` hook, then replacing the `render` method with a `return` statement and some other minor code refactors.

10. List a few ways styles can be used with components.

> For example 1) **Inline styles** within the JSX, by importing 2) **External CSS files**, using 3) **CSS modules** that are scoped to the component itself, using 4) **CSS-in-JS** libraries like Styled Components, using 5) **Tailwind CSS** framework to apply css classes in JSX code, or by using 6) **Sass** language

11.  How to render an HTML string coming from the server.

> Firstly making sure to sanitize the HTML string to avoid XSS attacks, then rendering by using the `dangerouslySetInnerHTML` attribute.
