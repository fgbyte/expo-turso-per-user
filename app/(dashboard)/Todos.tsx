import { Text } from "~/components/ui/text";
import { getDatabaseClient } from "~/db/utils";

export async function Todos() {

    const client = await getDatabaseClient();

    if (!client) {
        return <Text>Database not ready</Text>
    }

    const todos = await client.query.todos.findMany();
    console.log(todos)

    return (
        <Text>Todos</Text>
        //  <TodoList initialTodos={todos || []} />;
    )
}