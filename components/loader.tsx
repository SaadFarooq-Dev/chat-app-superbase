import { RingLoader } from "react-spinners";

type loaderProps = {
  loading: boolean
}

export default function Loader({loading}: loaderProps) {
  return (
    <RingLoader
    loading={loading}
    cssOverride = {{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '10px'
    }}
    color={'#36d7b7'}
    aria-label="Loading Spinner"
    data-testid="loader"
  />
  )
}
