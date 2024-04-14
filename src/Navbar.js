import { Link, useMatch, useResolvedPath } from "react-router-dom";
import './App.css';
export default function Navbar() {
    return (
        <nav className="nav">

            <ul>
                <CustomLink to="/Home">Home</CustomLink>
                <CustomLink to="/Q1">Q1</CustomLink>
                <CustomLink to="/Q2">Q2</CustomLink>
                <CustomLink to="/Q3">Q3</CustomLink>
                <CustomLink to="/Q4">Q4</CustomLink>
                <CustomLink to="/Q5">Q5</CustomLink>

                
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props} className={isActive ? "active" : ""}>{children}</Link>
        </li>
    );
}
