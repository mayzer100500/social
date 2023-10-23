import { useRouteError } from "react-router-dom"

export default function Error() {
    const error = useRouteError()

    return (
        <div style={{ margin: "0 auto", width: "80%", height: "100vh", padding: "100px", textAlign: "center" }}>
            <h1>Error: {error.message}</h1>
            <pre>{error.status} - {error.statusText}</pre>
        </div>
    )
}