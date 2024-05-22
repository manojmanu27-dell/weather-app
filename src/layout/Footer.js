import heartIcon from '../assets/heart.png';
import './footer.css'
export default function Footer(){
    return <footer className='footer'>
        <h6>Made in 
            <img src={heartIcon} alt="love icon" />
            BM
        </h6>
    </footer>
}