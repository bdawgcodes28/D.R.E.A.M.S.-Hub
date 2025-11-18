import React                        from 'react'
import { FaSchool }                 from "react-icons/fa";
import { GiPartyFlags }             from "react-icons/gi";
import { BsCalendar2DateFill }      from "react-icons/bs";
import { FaUserGroup }              from "react-icons/fa6";
import { BiSolidParty }             from "react-icons/bi";
import useIsMobile                  from '../../hooks/useIsMobile';

export default function HomeMetrics() {

    //======================================
    // METRIC HELPERS
    //======================================
    const isMobile = useIsMobile();

    // constants for icons
    const iconSize = isMobile ? 20 : 40;
    const valueSize = isMobile ? 20 : 40;
    const metricNameSize = isMobile ? 20 : 40;
    const animationSpeed = "4s"; // Animation duration for carousel

    const metrics = [
        {Name:"Schools Partnered",  Value: 5,       Icon: <FaSchool             size={iconSize}/>},
        {Name:"Total Volunteers",   Value: 50,      Icon: <FaUserGroup          size={iconSize}/>},
        {Name:"Total Programs",     Value: 12,      Icon: <BiSolidParty         size={iconSize}/>},
        {Name:"Years in Operation", Value: 2,       Icon: <BsCalendar2DateFill  size={iconSize}/>},
    ];
  return (
    <div className={`w-full h-[50vh] max-h-[250px] ${isMobile ? "overflow-hidden" : "flex justify-evenly"} gap-[0px] items-center border-0 border-[black]`}>
        {isMobile ? (
            <div className="flex animate-scroll" style={{animationDuration: animationSpeed}}>
                {/* First set of metrics */}
                {metrics.map((metric, idx)=>{
                    return <div key={`first-${idx}`} className="w-[200px] flex-shrink-0 border-0 border-[black] p-[10px] flex gap-[10px] items-center min-w-fit">
                        {metric.Icon}
                        <p className={`text-[${valueSize}]`} style={{fontWeight:"bold"}}>{metric.Value}+</p>
                        <p className={`text-[${metricNameSize}] w-[100px]`}>{metric.Name}</p>
                    </div>
                })}
                {/* Duplicate set for seamless loop */}
                {metrics.map((metric, idx)=>{
                    return <div key={`second-${idx}`} className="w-[200px] flex-shrink-0 border-0 border-[black] p-[10px] flex gap-[10px] items-center min-w-fit">
                        {metric.Icon}
                        <p className={`text-[${valueSize}]`} style={{fontWeight:"bold"}}>{metric.Value}+</p>
                        <p className={`text-[${metricNameSize}] w-[100px]`}>{metric.Name}</p>
                    </div>
                })}
            </div>
        ) : (
            metrics.map((metric, idx)=>{
                return <div key={idx} className="w-[25%] max-w-[250px] border-0 border-[black] p-[10px] flex gap-[10px] items-center min-w-fit">
                    {metric.Icon}
                    <p className={`text-[${valueSize}]`} style={{fontWeight:"bold"}}>{metric.Value}+</p>
                    <p className={`text-[${metricNameSize}] w-[100px]`}>{metric.Name}</p>
                </div>
            })
        )}
    </div>
  )
}
