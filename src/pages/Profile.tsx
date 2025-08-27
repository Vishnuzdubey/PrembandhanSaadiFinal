import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import sampleProfiles from '@/lib/sampleProfiles';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const profile: any = sampleProfiles.find((p: any) => p.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">Profile not found.</div>
        </main>
        <Footer />
      </div>
    );
  }

  const mainImage = (profile.images && profile.images.length > 0 && profile.images[0].url) || profile.photo || "";
  const otherImages = (profile.images && profile.images.slice(1).map((i: any) => i.url)) || [];

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
            <div className="md:flex md:gap-8">
              <div className="md:w-1/3">
                <div className="rounded-lg overflow-hidden">
                  {mainImage ? (
                    <img src={mainImage} alt={profile.name} className="w-full h-80 object-cover" />
                  ) : (
                    <div className="w-full h-80 bg-gray-100 flex items-center justify-center">No Image</div>
                  )}
                </div>

                {otherImages.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {otherImages.map((src: string, idx: number) => (
                      <img key={idx} src={src} alt={`image-${idx}`} className="w-full h-20 object-cover rounded" />
                    ))}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 bg-rose text-white py-2 rounded-md">Express Interest</button>
                  <button className="flex-1 border border-rose text-rose py-2 rounded-md">Send Message</button>
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                    <p className="text-sm text-muted-foreground">{profile.location || ''} {profile.age ? `• ${profile.age} years` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{profile.gender}</p>
                    {profile.featured && <span className="inline-block mt-2 px-3 py-1 bg-gold text-sm rounded-full">Featured</span>}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Personal Details</h3>
                    <p><strong>Date of Birth:</strong> {formatDate(profile.dateOfBirth)}</p>
                    <p><strong>Marital Status:</strong> {profile.maritalStatus || '-'}</p>
                    <p><strong>Religion:</strong> {profile.religion || '-'}</p>
                    <p><strong>Caste:</strong> {profile.caste || '-'}</p>
                    <p><strong>Manglik:</strong> {profile.manglik || '-'}</p>
                    <p><strong>Kundali:</strong> {profile.kundali || '-'}</p>
                    <p><strong>Gotra:</strong> {profile.gotra || '-'}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Education & Occupation</h3>
                    <p><strong>Education:</strong> {profile.education || '-'}</p>
                    <p><strong>Occupation:</strong> {profile.occupation || '-'}</p>
                    <p><strong>Income:</strong> {profile.income || '-'}</p>
                    <p><strong>District / State:</strong> {profile.district || '-'} / {profile.state || '-'}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Physical Attributes</h3>
                    <p><strong>Height:</strong> {profile.height ? `${profile.height}` : '-'} {profile.height ? 'ft' : ''}</p>
                    <p><strong>Weight:</strong> {profile.weight ? `${profile.weight} kg` : '-'}</p>
                    <p><strong>Complexion:</strong> {profile.complexion || '-'}</p>
                    <p><strong>Blood Group:</strong> {profile.bloodGroup || '-'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold">Family</h3>
                    <p><strong>Father:</strong> {profile.fatherName || '-'} ({profile.fatherOcc || '-'})</p>
                    <p><strong>Mother:</strong> {profile.motherName || '-'} ({profile.motherOcc || '-'})</p>
                    <p><strong>Siblings:</strong> {profile.sibling1Name || '-'} {profile.sibling1Occ ? `(${profile.sibling1Occ})` : ''}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold">Other Details</h3>
                  <p><strong>Diet:</strong> {profile.diet || '-'}</p>
                  <p><strong>Disability:</strong> {profile.disability || '-'}</p>
                  <p><strong>In Caste:</strong> {profile.inCaste || '-'}</p>
                  <p><strong>Particulars:</strong> {profile.particulars || '-'}</p>
                  <p className="mt-2"><strong>Remarks:</strong> {profile.remarks || '-'}</p>
                </div>

                <div className="mt-6 text-sm text-muted-foreground">
                  <p><strong>Created:</strong> {formatDate(profile.createdAt)}</p>
                  <p><strong>Updated:</strong> {formatDate(profile.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
