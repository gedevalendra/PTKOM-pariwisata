<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PartnerValidationNotification extends Notification
{
    use Queueable;

    public string $status;
    public ?string $rejectionReason;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $status, ?string $rejectionReason = null)
    {
        $this->status = $status;
        $this->rejectionReason = $rejectionReason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $businessName = $notifiable->business_name ?? 'Usaha Anda';

        if ($this->status === 'approved') {
            return (new MailMessage)
                ->subject('Selamat! Kemitraan Pariwisata Anda Telah Disetujui')
                ->greeting('Halo, ' . $notifiable->name . '!')
                ->line('Kabar baik! Pengajuan pendaftaran mitra pariwisata untuk "' . $businessName . '" telah disetujui oleh Administrator Jelajah Lampung.')
                ->line('Anda sekarang dapat mengakses dashboard mitra usaha Anda.')
                ->action('Buka Dashboard', url('/dashboard'))
                ->line('Terima kasih telah berkolaborasi memajukan pariwisata Provinsi Lampung.');
        }

        return (new MailMessage)
            ->subject('Pemberitahuan Status Pendaftaran Mitra Pariwisata')
            ->greeting('Halo, ' . $notifiable->name . ',')
            ->line('Terima kasih telah mengajukan pendaftaran kemitraan untuk "' . $businessName . '".')
            ->line('Mohon maaf, saat ini pendaftaran kemitraan Anda belum dapat disetujui.')
            ->line($this->rejectionReason ? 'Alasan penolakan: "' . $this->rejectionReason . '"' : 'Alasan: Dokumen atau kriteria persyaratan belum terpenuhi.')
            ->line('Silakan periksa kembali profil usaha Anda di dashboard untuk informasi lebih lanjut.')
            ->action('Periksa Dashboard', url('/dashboard'));
    }
}
