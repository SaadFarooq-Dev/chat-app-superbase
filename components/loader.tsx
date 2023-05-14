import { RingLoader } from "react-spinners";

type loaderProps = {
  loading: boolean,
  left?: string
}

export default function Loader({loading, left}: loaderProps) {
  return (
    <RingLoader
    loading={loading}
    cssOverride = {{
      position: 'absolute',
      top: '50%',
      left: left || '50%',
      transform: 'translate(-50%, -50%)',
      padding: '10px'
    }}
    color={'#002D62'}
    aria-label="Loading Spinner"
    data-testid="loader"
  />
  )
}
