import './App.css'
import { Avatar, Box, Button, Circle, Fade, FormControl, FormLabel, HStack, Input, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react';
import { RiSendPlane2Line } from "react-icons/ri";
import { useHover } from "@uidotdev/usehooks";


// type Emoji = Record<string, string>

// const EMOJI_REACTIONS: Emoji = {
//   'thumbs up': '👍',
//   'thumbs down': '👎',
//   'happy': '😄',
//   'confused': '😕',
//   'heart': '❤️',
//   'party': '🎉',
// }



type Position = {
  x: number,
  y: number,
}

type Reaction = {
  position: Position,
  comment: string,
}


function ReactionPin(props: { isLoading?: boolean }) {
  return (
    <Box>
      <Circle
        p={2}
        bg={'grey'}
      >
        {props.isLoading ? <Spinner /> : <Avatar name='Maciek Kowalski' />}
      </Circle>
    </Box>
  )
}

function ReactionForm(props: { onSubmit: (comment: string) => void }) {
  const [comment, setComment] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value)
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    props.onSubmit(comment)
  }

  return (
    <Box onClick={e => e.stopPropagation()}>
      <Stack>
        <HStack spacing={2}>
          <Avatar size={'sm'} name='Maciek Kowalski' />
          <Text>Maciek Kowalski</Text>
        </HStack>
        <HStack>

          <FormControl>
            <Input onChange={handleChange} value={comment} />
          </FormControl>
          <Button onClick={handleSubmit}><RiSendPlane2Line /></Button>
        </HStack>
      </Stack>

    </Box>
  )
}

function ReactionContainer(props: Position & { children: React.ReactNode }) {
  const { x, y, children } = props;


  return (
    <Box
      position='absolute'
      top={`${y}px`}
      left={`${x}px`}
      transform='translate(-32px, -32px)'
      fontSize='1rem'
      zIndex={100}
    >
      <Box position={'relative'}>
        {children}
      </Box>
    </Box>
  )
}

function Reaction(reaction: Reaction) {
  const [ref, hovering] = useHover();

  return (
    <div ref={ref}>

      <ReactionContainer {...reaction.position}
      >
        <HStack pr={4} borderRadius={4}>
          <ReactionPin />
          <Fade in={hovering}>
            <Text>
              {reaction.comment}
            </Text>
          </Fade>
        </HStack>
      </ReactionContainer>
    </div>
  )
}



function App() {
  const [currentPosition, setCurrentPosition] = useState<Position>()
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSaveReaction = async (reaction: Reaction) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setReactions([...reactions, reaction]);
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const x = e.clientX
    const y = e.clientY
    setCurrentPosition({ x, y })
  }

  const handleSubmit = async (comment: string) => {
    setIsProcessing(true);
    await handleSaveReaction({ position: currentPosition!, comment });
    setIsProcessing(false);
    setCurrentPosition(undefined);
  }

  return (
    <Box h='100vh' w='100vw' border={'1px solid red'} cursor='pointer' onClick={handleClick}>
      {
        currentPosition &&
        <ReactionContainer {...currentPosition}>
          <HStack spacing={8}>
            <ReactionPin isLoading={isProcessing} />
            <ReactionForm onSubmit={handleSubmit} />
          </HStack>
        </ ReactionContainer>
      }

      {
        reactions.map((reaction, index) => (
          <Reaction key={index} {...reaction} />
        ))
      }
    </Box>
  );
}

export default App
