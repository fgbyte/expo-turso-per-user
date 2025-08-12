import { Text } from '~/components/ui/text';
import { Todos } from './Todos';


export default function Screen() {

  return (
    <>
      <Text className='text-3xl font-black tracking-tight'>Todos</Text>
      <Text className='text-black/60 dark:text-white/60'>
        The todos you add below are created inside your own database.
      </Text>
      <Todos />
    </>
  );
}
