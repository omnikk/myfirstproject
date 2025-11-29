from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Dict, Any
import models
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/analytics/overview")
def get_analytics_overview(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_salons = db.query(models.Salon).count()
    total_masters = db.query(models.Master).count()
    total_clients = db.query(models.Client).count()
    total_appointments = db.query(models.Appointment).count()
    
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_appointments = db.query(models.Appointment).filter(
        models.Appointment.start_time >= thirty_days_ago
    ).count()
    
    upcoming_appointments = db.query(models.Appointment).filter(
        models.Appointment.start_time > datetime.now()
    ).count()
    
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    today_appointments = db.query(models.Appointment).filter(
        and_(
            models.Appointment.start_time >= today_start,
            models.Appointment.start_time < today_end
        )
    ).count()
    
    return {
        "total_salons": total_salons,
        "total_masters": total_masters,
        "total_clients": total_clients,
        "total_appointments": total_appointments,
        "recent_appointments_30d": recent_appointments,
        "upcoming_appointments": upcoming_appointments,
        "today_appointments": today_appointments
    }

@router.get("/analytics/popular-services")
def get_popular_services(db: Session = Depends(get_db)):
    services_stats = db.query(
        models.Appointment.service,
        func.count(models.Appointment.id).label('count')
    ).group_by(
        models.Appointment.service
    ).order_by(
        func.count(models.Appointment.id).desc()
    ).all()
    
    return [
        {"service": service, "count": count}
        for service, count in services_stats
    ]

@router.get("/analytics/salons-stats")
def get_salons_stats(db: Session = Depends(get_db)):
    salons_stats = db.query(
        models.Salon.name,
        func.count(models.Appointment.id).label('appointments_count')
    ).join(
        models.Master, models.Salon.id == models.Master.salon_id
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).group_by(
        models.Salon.id, models.Salon.name
    ).all()
    
    return [
        {"salon_name": name, "appointments_count": count}
        for name, count in salons_stats
    ]

@router.get("/analytics/masters-workload")
def get_masters_workload(db: Session = Depends(get_db)):
    masters_stats = db.query(
        models.Master.name,
        models.Salon.name.label('salon_name'),
        func.count(models.Appointment.id).label('appointments_count')
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).join(
        models.Salon, models.Master.salon_id == models.Salon.id
    ).group_by(
        models.Master.id, models.Master.name, models.Salon.name
    ).order_by(
        func.count(models.Appointment.id).desc()
    ).all()
    
    return [
        {
            "master_name": name,
            "salon_name": salon_name,
            "appointments_count": count
        }
        for name, salon_name, count in masters_stats
    ]

@router.get("/analytics/peak-hours")
def get_peak_hours(db: Session = Depends(get_db)):
    peak_hours = db.query(
        func.extract('hour', models.Appointment.start_time).label('hour'),
        func.count(models.Appointment.id).label('count')
    ).group_by(
        func.extract('hour', models.Appointment.start_time)
    ).order_by(
        func.count(models.Appointment.id).desc()
    ).all()
    
    return [
        {
            "hour": int(hour),
            "count": count,
            "time_label": f"{int(hour)}:00"
        }
        for hour, count in peak_hours
    ]

@router.get("/analytics/appointments-by-day")
def get_appointments_by_day(days: int = 30, db: Session = Depends(get_db)):
    start_date = datetime.now() - timedelta(days=days)
    
    appointments_by_day = db.query(
        func.date(models.Appointment.start_time).label('date'),
        func.count(models.Appointment.id).label('count')
    ).filter(
        models.Appointment.start_time >= start_date
    ).group_by(
        func.date(models.Appointment.start_time)
    ).order_by(
        func.date(models.Appointment.start_time)
    ).all()
    
    return [
        {
            "date": str(date),
            "count": count
        }
        for date, count in appointments_by_day
    ]

@router.get("/analytics/financial-overview")
def get_financial_overview(db: Session = Depends(get_db)):
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Выручка за сегодня
    today_revenue = db.query(func.sum(models.Appointment.price)).filter(
        and_(
            models.Appointment.start_time >= today_start,
            models.Appointment.start_time < today_end,
            models.Appointment.status == "confirmed"
        )
    ).scalar() or 0
    
    # Выручка за месяц
    month_revenue = db.query(func.sum(models.Appointment.price)).filter(
        and_(
            models.Appointment.start_time >= month_start,
            models.Appointment.status == "confirmed"
        )
    ).scalar() or 0
    
    # Общая выручка
    total_revenue = db.query(func.sum(models.Appointment.price)).filter(
        models.Appointment.status == "confirmed"
    ).scalar() or 0
    
    # Количество отмененных записей
    cancelled_count = db.query(models.Appointment).filter(
        models.Appointment.status == "cancelled"
    ).count()
    
    # Потерянная выручка от отмен
    cancelled_revenue = db.query(func.sum(models.Appointment.price)).filter(
        models.Appointment.status == "cancelled"
    ).scalar() or 0
    
    # Средний чек
    avg_check = db.query(func.avg(models.Appointment.price)).filter(
        models.Appointment.status == "confirmed"
    ).scalar() or 0
    
    return {
        "today_revenue": round(today_revenue, 2),
        "month_revenue": round(month_revenue, 2),
        "total_revenue": round(total_revenue, 2),
        "cancelled_count": cancelled_count,
        "cancelled_revenue": round(cancelled_revenue, 2),
        "average_check": round(avg_check, 2)
    }

@router.get("/analytics/revenue-by-salon")
def get_revenue_by_salon(db: Session = Depends(get_db)):
    revenue_stats = db.query(
        models.Salon.name,
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('appointments_count')
    ).join(
        models.Master, models.Salon.id == models.Master.salon_id
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).filter(
        models.Appointment.status == "confirmed"
    ).group_by(
        models.Salon.id, models.Salon.name
    ).all()
    
    return [
        {
            "salon_name": name,
            "revenue": round(revenue or 0, 2),
            "appointments_count": count
        }
        for name, revenue, count in revenue_stats
    ]

@router.get("/analytics/revenue-by-service")
def get_revenue_by_service(db: Session = Depends(get_db)):
    service_revenue = db.query(
        models.Appointment.service,
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('count')
    ).filter(
        models.Appointment.status == "confirmed"
    ).group_by(
        models.Appointment.service
    ).order_by(
        func.sum(models.Appointment.price).desc()
    ).all()
    
    return [
        {
            "service": service,
            "revenue": round(revenue or 0, 2),
            "count": count
        }
        for service, revenue, count in service_revenue
    ]

@router.get("/analytics/master-earnings")
def get_master_earnings(db: Session = Depends(get_db)):
    master_stats = db.query(
        models.Master.name,
        models.Master.hourly_rate,
        models.Salon.name.label('salon_name'),
        func.count(models.Appointment.id).label('appointments_count'),
        func.sum(models.Appointment.price).label('total_revenue')
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).join(
        models.Salon, models.Master.salon_id == models.Salon.id
    ).filter(
        models.Appointment.status == "confirmed"
    ).group_by(
        models.Master.id, models.Master.name, models.Master.hourly_rate, models.Salon.name
    ).order_by(
        func.sum(models.Appointment.price).desc()
    ).all()
    
    result = []
    for name, hourly_rate, salon_name, appointments_count, total_revenue in master_stats:
        earnings = appointments_count * hourly_rate
        result.append({
            "master_name": name,
            "salon_name": salon_name,
            "hourly_rate": hourly_rate,
            "appointments_count": appointments_count,
            "total_revenue": round(total_revenue or 0, 2),
            "master_earnings": round(earnings, 2)
        })
    
    return result

@router.get("/analytics/daily-revenue")
def get_daily_revenue(days: int = 30, db: Session = Depends(get_db)):
    start_date = datetime.now() - timedelta(days=days)
    
    daily_revenue = db.query(
        func.date(models.Appointment.start_time).label('date'),
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('count')
    ).filter(
        and_(
            models.Appointment.start_time >= start_date,
            models.Appointment.status == "confirmed"
        )
    ).group_by(
        func.date(models.Appointment.start_time)
    ).order_by(
        func.date(models.Appointment.start_time)
    ).all()
    
    return [
        {
            "date": str(date),
            "revenue": round(revenue or 0, 2),
            "count": count
        }
        for date, revenue, count in daily_revenue
    ]

@router.get("/analytics/export-csv")
def export_to_csv(db: Session = Depends(get_db)):
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    appointments = db.query(
        models.Appointment.id,
        models.Appointment.start_time,
        models.Appointment.service,
        models.Appointment.price,
        models.Appointment.status,
        models.Master.name.label('master_name'),
        models.Client.name.label('client_name'),
        models.Salon.name.label('salon_name')
    ).join(
        models.Master, models.Appointment.master_id == models.Master.id
    ).join(
        models.Client, models.Appointment.client_id == models.Client.id
    ).join(
        models.Salon, models.Master.salon_id == models.Salon.id
    ).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['ID', 'Дата', 'Услуга', 'Цена', 'Статус', 'Мастер', 'Клиент', 'Салон'])
    
    for apt in appointments:
        writer.writerow([
            apt.id,
            apt.start_time.strftime('%Y-%m-%d %H:%M'),
            apt.service,
            apt.price,
            apt.status,
            apt.master_name,
            apt.client_name,
            apt.salon_name
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=analytics.csv"}
    )

@router.get("/analytics/export-financial-csv")
def export_financial_csv(db: Session = Depends(get_db)):
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    data = db.query(
        models.Salon.name.label('salon_name'),
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('appointments_count')
    ).join(
        models.Master, models.Salon.id == models.Master.salon_id
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).filter(
        models.Appointment.status == "confirmed"
    ).group_by(
        models.Salon.id, models.Salon.name
    ).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Салон', 'Выручка', 'Количество записей'])
    
    for row in data:
        writer.writerow([row.salon_name, row.revenue or 0, row.appointments_count])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=financial_report.csv"}
    )

@router.get("/analytics/export-masters-csv")
def export_masters_csv(db: Session = Depends(get_db)):
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    data = db.query(
        models.Master.name,
        models.Master.hourly_rate,
        models.Salon.name.label('salon_name'),
        func.count(models.Appointment.id).label('appointments_count'),
        func.sum(models.Appointment.price).label('total_revenue')
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).join(
        models.Salon, models.Master.salon_id == models.Salon.id
    ).filter(
        models.Appointment.status == "confirmed"
    ).group_by(
        models.Master.id, models.Master.name, models.Master.hourly_rate, models.Salon.name
    ).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Мастер', 'Салон', 'Ставка/час', 'Записей', 'Выручка', 'Зарплата'])
    
    for row in data:
        earnings = row.appointments_count * row.hourly_rate
        writer.writerow([
            row.name,
            row.salon_name,
            row.hourly_rate,
            row.appointments_count,
            row.total_revenue or 0,
            earnings
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=masters_report.csv"}
    )

@router.get("/analytics/export-services-csv")
def export_services_csv(db: Session = Depends(get_db)):
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    data = db.query(
        models.Appointment.service,
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('count')
    ).filter(
        models.Appointment.status == "confirmed"
    ).group_by(
        models.Appointment.service
    ).order_by(
        func.sum(models.Appointment.price).desc()
    ).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Услуга', 'Выручка', 'Количество'])
    
    for row in data:
        writer.writerow([row.service, row.revenue or 0, row.count])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=services_report.csv"}
    )

@router.get("/analytics/filtered-overview")
def get_filtered_overview(start_date: str = None, end_date: str = None, db: Session = Depends(get_db)):
    from datetime import datetime
    
    query_filter = [models.Appointment.status == "confirmed"]
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query_filter.append(models.Appointment.start_time >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query_filter.append(models.Appointment.start_time <= end_dt)
    
    total_revenue = db.query(func.sum(models.Appointment.price)).filter(*query_filter).scalar() or 0
    total_appointments = db.query(models.Appointment).filter(*query_filter).count()
    avg_check = db.query(func.avg(models.Appointment.price)).filter(*query_filter).scalar() or 0
    
    cancelled_filter = [models.Appointment.status == "cancelled"]
    if start_date:
        cancelled_filter.append(models.Appointment.start_time >= start_dt)
    if end_date:
        cancelled_filter.append(models.Appointment.start_time <= end_dt)
    
    cancelled_count = db.query(models.Appointment).filter(*cancelled_filter).count()
    cancelled_revenue = db.query(func.sum(models.Appointment.price)).filter(*cancelled_filter).scalar() or 0
    
    return {
        "total_revenue": round(total_revenue, 2),
        "total_appointments": total_appointments,
        "average_check": round(avg_check, 2),
        "cancelled_count": cancelled_count,
        "cancelled_revenue": round(cancelled_revenue, 2)
    }

@router.get("/analytics/filtered-revenue-by-salon")
def get_filtered_revenue_by_salon(start_date: str = None, end_date: str = None, db: Session = Depends(get_db)):
    from datetime import datetime
    
    query = db.query(
        models.Salon.name,
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('appointments_count')
    ).join(
        models.Master, models.Salon.id == models.Master.salon_id
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).filter(
        models.Appointment.status == "confirmed"
    )
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(models.Appointment.start_time >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(models.Appointment.start_time <= end_dt)
    
    revenue_stats = query.group_by(models.Salon.id, models.Salon.name).all()
    
    return [
        {
            "salon_name": name,
            "revenue": round(revenue or 0, 2),
            "appointments_count": count
        }
        for name, revenue, count in revenue_stats
    ]

@router.get("/analytics/filtered-revenue-by-service")
def get_filtered_revenue_by_service(start_date: str = None, end_date: str = None, db: Session = Depends(get_db)):
    from datetime import datetime
    
    query = db.query(
        models.Appointment.service,
        func.sum(models.Appointment.price).label('revenue'),
        func.count(models.Appointment.id).label('count')
    ).filter(
        models.Appointment.status == "confirmed"
    )
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(models.Appointment.start_time >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(models.Appointment.start_time <= end_dt)
    
    service_revenue = query.group_by(
        models.Appointment.service
    ).order_by(
        func.sum(models.Appointment.price).desc()
    ).all()
    
    return [
        {
            "service": service,
            "revenue": round(revenue or 0, 2),
            "count": count
        }
        for service, revenue, count in service_revenue
    ]

@router.get("/analytics/filtered-master-earnings")
def get_filtered_master_earnings(start_date: str = None, end_date: str = None, db: Session = Depends(get_db)):
    from datetime import datetime
    
    query = db.query(
        models.Master.name,
        models.Master.hourly_rate,
        models.Salon.name.label('salon_name'),
        func.count(models.Appointment.id).label('appointments_count'),
        func.sum(models.Appointment.price).label('total_revenue')
    ).join(
        models.Appointment, models.Master.id == models.Appointment.master_id
    ).join(
        models.Salon, models.Master.salon_id == models.Salon.id
    ).filter(
        models.Appointment.status == "confirmed"
    )
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
        query = query.filter(models.Appointment.start_time >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
        query = query.filter(models.Appointment.start_time <= end_dt)
    
    master_stats = query.group_by(
        models.Master.id, models.Master.name, models.Master.hourly_rate, models.Salon.name
    ).order_by(
        func.sum(models.Appointment.price).desc()
    ).all()
    
    result = []
    for name, hourly_rate, salon_name, appointments_count, total_revenue in master_stats:
        earnings = appointments_count * hourly_rate
        result.append({
            "master_name": name,
            "salon_name": salon_name,
            "hourly_rate": hourly_rate,
            "appointments_count": appointments_count,
            "total_revenue": round(total_revenue or 0, 2),
            "master_earnings": round(earnings, 2)
        })
    
    return result