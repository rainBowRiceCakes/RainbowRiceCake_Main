import './PartnerStatCard.css';

const PartnerStatCard = ({ title, count, icon, color }) => {
    return (
        <div className="stat_card">
            <div className="stat_info">
                <p className="stat_title">{title}</p>
                <h2 className="stat_count">{count}건</h2>
            </div>
            <div className={`stat_icon_box ${color}`}>
                {icon}
            </div>
        </div>
    );
};

export default PartnerStatCard;